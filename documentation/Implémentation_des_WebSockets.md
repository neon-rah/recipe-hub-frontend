### Implémentation des WebSockets pour les notifications en temps réel  

Nous allons ajouter des WebSockets à ton projet **Spring Boot** pour permettre l'envoi de notifications en temps réel. Nous allons suivre ces étapes :  

1. **Configurer WebSockets dans Spring Boot**  
2. **Créer un service de gestion des WebSockets**  
3. **Envoyer des notifications en temps réel lors d'un suivi ou d'une publication de recette**  
4. **Gérer les WebSockets côté frontend avec Next.js**  

---

## **1. Configuration des WebSockets dans Spring Boot**  

Spring Boot utilise `Spring WebSocket` pour gérer les connexions WebSocket. Nous allons d'abord ajouter la configuration nécessaire.  

### **1.1 Ajout de la dépendance Spring WebSocket**  
Dans ton `pom.xml`, ajoute la dépendance suivante si elle n'est pas déjà présente :  

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-websocket</artifactId>
</dependency>
```

---

### **1.2 Création de la configuration WebSocket**  

Dans `config/WebSocketConfig.java` :  

```java
package org.schoolproject.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOrigins("*")  // Permettre toutes les origines (à adapter en prod)
                .withSockJS(); // Supporte les clients sans WebSockets natifs
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic");  // Utilisé pour envoyer des messages aux clients
        registry.setApplicationDestinationPrefixes("/app"); // Préfixe des messages envoyés au backend
    }
}
```

---

## **2. Création d'un Service WebSocket pour les notifications**  

Nous allons créer un service qui enverra des notifications aux utilisateurs abonnés.  

Dans `services/NotificationService.java` :  

```java
package org.schoolproject.backend.services;

import lombok.RequiredArgsConstructor;
import org.schoolproject.backend.entities.Notification;
import org.schoolproject.backend.repositories.NotificationRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationRepository notificationRepository;

    // Envoi d'une notification en temps réel
    public void sendNotification(Long userId, String message) {
        String destination = "/topic/notifications/" + userId;
        messagingTemplate.convertAndSend(destination, message);

        // Enregistrer la notification en base de données (optionnel)
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setMessage(message);
        notificationRepository.save(notification);
    }
}
```

---

## **3. Envoyer des notifications lors d'un suivi ou d'une publication**  

Nous allons appeler `NotificationService` lorsque :  
1. Un utilisateur suit un autre utilisateur  
2. Un utilisateur publie une recette  

### **3.1 Notification lorsqu'un utilisateur suit un autre**  

Dans ton service `FollowService.java` :  

```java
package org.schoolproject.backend.services;

import lombok.RequiredArgsConstructor;
import org.schoolproject.backend.entities.User;
import org.schoolproject.backend.repositories.UserRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FollowService {

    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public void followUser(Long followerId, Long followedId) {
        User follower = userRepository.findById(followerId).orElseThrow();
        User followed = userRepository.findById(followedId).orElseThrow();

        followed.getFollowers().add(follower);
        userRepository.save(followed);

        // Envoyer une notification en temps réel
        String message = follower.getName() + " vous suit maintenant.";
        notificationService.sendNotification(followedId, message);
    }
}
```

---

### **3.2 Notification lorsqu'un utilisateur publie une recette**  

Dans `RecipeService.java` :  

```java
package org.schoolproject.backend.services;

import lombok.RequiredArgsConstructor;
import org.schoolproject.backend.entities.Recipe;
import org.schoolproject.backend.entities.User;
import org.schoolproject.backend.repositories.RecipeRepository;
import org.schoolproject.backend.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecipeService {

    private final RecipeRepository recipeRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public void publishRecipe(Long userId, Recipe recipe) {
        User user = userRepository.findById(userId).orElseThrow();
        recipe.setAuthor(user);
        recipeRepository.save(recipe);

        // Notifier tous les abonnés de l'utilisateur
        List<User> followers = user.getFollowers();
        String message = user.getName() + " a publié une nouvelle recette : " + recipe.getTitle();

        for (User follower : followers) {
            notificationService.sendNotification(follower.getIdUser(), message);
        }
    }
}
```

---

## **4. Implémentation côté Frontend (Next.js + Tailwind)**  

Nous allons maintenant gérer les WebSockets côté **Next.js** en utilisant **SockJS** et **Stomp.js**.  

### **4.1 Installation des dépendances**  

```bash
npm install @stomp/stompjs sockjs-client
```

---

### **4.2 Connexion aux WebSockets**  

Dans `components/NotificationListener.tsx` :  

```tsx
import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const NotificationListener = ({ userId }: { userId: string }) => {
  const [notifications, setNotifications] = useState<string[]>([]);
  let client: Client;

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log("WebSocket Connected");
        client.subscribe(`/topic/notifications/${userId}`, (message) => {
          setNotifications((prev) => [...prev, message.body]);
        });
      },
      onDisconnect: () => console.log("WebSocket Disconnected"),
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, [userId]);

  return (
    <div className="fixed top-5 right-5 w-96 bg-white shadow-lg p-4 rounded-lg">
      <h3 className="font-bold text-lg">Notifications</h3>
      <ul>
        {notifications.map((notif, index) => (
          <li key={index} className="p-2 border-b">{notif}</li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationListener;
```

---

### **4.3 Utilisation du composant dans ton application**  

Ajoute le composant dans `pages/_app.tsx` ou `layout.tsx` pour écouter les notifications en temps réel :  

```tsx
import NotificationListener from "@/components/NotificationListener";

function MyApp({ Component, pageProps }) {
  const userId = "123"; // Remplace avec l'ID réel de l'utilisateur

  return (
    <>
      <NotificationListener userId={userId} />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
```

---

## **Conclusion**  

Avec cette implémentation :  
✅ WebSockets configurés avec Spring Boot  
✅ Notifications envoyées lorsque quelqu'un suit un utilisateur ou publie une recette  
✅ Intégration des notifications en temps réel avec Next.js et Tailwind  

Tu peux maintenant tester et améliorer cette fonctionnalité ! 🚀