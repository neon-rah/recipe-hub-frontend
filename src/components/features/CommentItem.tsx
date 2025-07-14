// CommentItem.tsx
import { CommentDTO } from '@/types/comment';
import { timeSince } from '@/lib/utils';
import { UserCircle, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import useAuth from '@/hooks/useAuth';
import CommentInput from './CommentInput';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

interface CommentItemProps {
    comment: CommentDTO;
    onReply: (parentId: number, content: string) => void;
    onDelete: (id: number) => void;
    level?: number;
}

export default function CommentItem({ comment, onReply, onDelete, level = 0 }: CommentItemProps) {
    const [showReplyInput, setShowReplyInput] = useState(false);
    const { user } = useAuth();
    const { toast } = useToast();
    const isOwner = user?.idUser === comment.userId;
    // const isOwner = true;

    const handleReplySubmit = async (content: string) => {
        try {
            const parentId = comment.parentId === 0 ? comment.idComment : comment.parentId ;
            onReply(parentId, content);
            setShowReplyInput(false);
        } catch (err) {
            toast({
                title: 'Erreur',
                description: err instanceof Error ? err.message : 'Erreur lors de la réponse.',
                variant: 'destructive',
            });
        }
    };

    const handleDelete = async () => {
        try {
            await onDelete(comment.idComment);
        } catch (err) {
            toast({
                title: 'Erreur',
                description: err instanceof Error ? err.message : 'Erreur suppression',
                variant: 'destructive',
            });
        }
    };

    return (
        <div className={`flex gap-3 ${level > 0 ? 'pl-6' : ''}`}>
            <div className="flex-shrink-0">
                {comment.userProfilePic ? (
                    <img
                        src={comment.userProfilePic}
                        alt={comment.userFullName}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                    />
                ) : (
                    <UserCircle className="w-10 h-10 text-gray-400" />
                )}
            </div>
            <div className="flex-1">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <Link
                                href={`/profile/${comment.userId}`}
                                className="font-medium text-sm text-gray-900 dark:text-gray-100 hover:underline"
                            >
                                {comment.userFullName}
                            </Link>
                            <p className="mt-1 text-sm text-gray-800 dark:text-gray-200 whitespace-pre-line">{comment.content}</p>
                            <div className="flex gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                                <span>{timeSince(comment.createdAt)}</span>
                                <span
                                    className="cursor-pointer hover:text-blue-500"
                                    onClick={() => setShowReplyInput(!showReplyInput)}
                                >
                  Répondre
                </span>
                            </div>
                        </div>
                        {isOwner && (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <div className="cursor-pointer p-1 text-gray-400 bg-transparent  hover:bg-background/80 hover:text-gray-600">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </div>
                                </PopoverTrigger>
                                <PopoverContent className="w-32 p-2 bg-white dark:bg-gray-800 shadow-md rounded">
                                    <div
                                        onClick={handleDelete}
                                        className="text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900 w-full text-left px-2 py-1 rounded cursor-pointer"
                                    >
                                        Supprimer
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )}
                    </div>
                </div>

                {showReplyInput && (
                    <div className="mt-3">
                        <CommentInput onSubmit={handleReplySubmit} placeholder="Votre réponse..." />
                    </div>
                )}


            </div>
        </div>
    );
}