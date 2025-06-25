import { CommentDTO } from '@/types/comment';
import { timeSince } from '@/lib/utils';
import {UserCircle, Trash2, Reply, MoreHorizontal} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useState } from 'react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import useAuth from '@/hooks/useAuth';
import CommentInput from "@/components/features/CommentInput";


interface CommentItemProps {
    comment: CommentDTO;
    onReply: (parentId: number, content: string) => void;
    onDelete: (id: number) => void;
    level?: number;
}

export default function CommentItem({ comment, onReply, onDelete }: CommentItemProps) {
    const [showReplyInput, setShowReplyInput] = useState(false);
    const { user } = useAuth();
    const { toast } = useToast();
    const isOwner = user?.idUser === comment.userId;

    const handleReplySubmit = async (content: string) => {
        try {
            await onReply(comment.idComment, content);
            setShowReplyInput(false);
        } catch (err) {
            toast({
                title: 'Erreur',
                description: err instanceof Error ? err.message : 'Échec de la publication de la réponse',
                variant: 'destructive',
            });
        }
    };

    const handleDelete = async () => {
        try {
            await onDelete(comment.idComment);
            toast({
                title: 'Succès',
                description: 'Commentaire supprimé avec succès',
            });
        } catch (err) {
            toast({
                title: 'Erreur',
                description: err instanceof Error ? err.message : 'Échec de la suppression du commentaire',
                variant: 'destructive',
            });
        }
    };

    // Afficher uniquement les enfants si parentId existe, pas de sous-sous-commentaires
    const isChild = comment.parentId !== null;
    const marginClass = isChild ? 'ml-8' : '';

    return (
        <div className={`flex gap-2 p-2 ${marginClass} bg-white dark:bg-primary-20 border-b border-neutral-200 dark:border-neutral-700`}>
            {comment.userProfilePic ? (
                <img src={comment.userProfilePic} alt={comment.userFullName} className="w-8 h-8 rounded-full object-cover" />
            ) : (
                <UserCircle className="w-8 h-8 text-neutral-500" />
            )}
            <div className="flex-1">
                <div className="text-sm text-text dark:text-dark">
                    <Link href={`/profile/${comment.userId}`} className="font-semibold hover:underline">
                        {comment.userFullName}
                    </Link>
                    <span className="ml-2 text-neutral-500">{comment.content}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-neutral-500 mt-1">
                    <span>{timeSince(comment.createdAt)}</span>
                    {!isChild && (
                        <button
                            className="text-secondary-500 hover:text-secondary dark:hover:text-secondary-dark-100 hover:underline flex items-center"
                            onClick={() => setShowReplyInput(!showReplyInput)}
                        >
                            <Reply className="w-4 h-4 mr-1" /> Répondre
                        </button>
                    )}
                    {isOwner && (
                        <Popover>
                            <PopoverTrigger>
                                <Button variant="ghost" size="icon" className="text-neutral-500 hover:text-neutral">
                                    <MoreHorizontal className="w-4 h-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-32 bg-white dark:bg-primary-20 p-0">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="w-full text-left text-alert-500 hover:bg-alert-gray-100 dark:hover:bg-neutral-600 rounded-none px-2 py-1"
                                    onClick={handleDelete}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </PopoverContent>
                        </Popover>
                    )}
                </div>
                {showReplyInput && !isChild && (
                    <div className="mt-2">
                        <CommentInput onSubmit={handleReplySubmit} placeholder="Écrivez une réponse..." />
                    </div>
                )}
            </div>
        </div>
    );
}