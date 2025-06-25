import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { UserCircle, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import useAuth from '@/hooks/useAuth';

interface CommentInputProps {
    onSubmit: (content: string) => void;
    placeholder?: string;
}

export default function CommentInput({ onSubmit, placeholder = 'Écrivez un commentaire...' }: CommentInputProps) {
    const [content, setContent] = useState('');
    const { user } = useAuth();
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) {
            toast({
                title: 'Erreur',
                description: 'Le commentaire ne peut pas être vide',
                variant: 'destructive',
            });
            return;
        }
        try {
            await onSubmit(content);
            setContent('');
        } catch (err) {
            toast({
                title: 'Erreur',
                description: err instanceof Error ? err.message : 'Échec de la publication du commentaire',
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="flex items-start gap-3 p-3 bg-white dark:bg-primary-20 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-sm">
            {user?.profileUrl ? (
                <img src={user.profileUrl} alt={user.userName} className="w-10 h-10 rounded-full object-cover" />
            ) : (
                <UserCircle className="w-10 h-10 text-neutral-500" />
            )}
            <form onSubmit={handleSubmit} className="flex-1">
                <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={placeholder}
                    className="w-full min-h-[40px] max-h-[150px] text-sm bg-gray-50 dark:bg-neutral-800 text-text dark:text-dark border border-neutral-300 dark:border-neutral-600 rounded-md focus:border-secondary focus:ring-1 focus:ring-secondary resize-none p-2"
                />
                <div className="flex justify-end mt-2">
                    <Button
                        type="submit"
                        size="sm"
                        className="bg-secondary hover:bg-secondary-dark text-white flex items-center gap-2"
                        disabled={!content.trim()}
                    >
                        <Send className="w-4 h-4" />
                        Publier
                    </Button>
                </div>
            </form>
        </div>
    );
}