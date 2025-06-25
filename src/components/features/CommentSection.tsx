import { useComments } from '@/hooks/useComment';
import CommentItem from './CommentItem';
import CommentInput from '@/components/features/CommentInput';
import { CommentDTO } from '@/types/comment';

interface CommentSectionProps {
    recipeId: number;
}

export default function CommentSection({ recipeId }: CommentSectionProps) {
    const { comments, handleCreateComment, handleCreateReply, handleDeleteComment } = useComments(recipeId);

    // Débogage : Afficher les commentaires reçus
    console.log("recipeId", recipeId);
    console.log('Commentaires reçus :', comments);

    // Séparer parents et enfants
    const parentComments = comments.filter((c) => c.parentId == null);
    const childComments = comments.filter((c) => c.parentId !== null);

    // Débogage : Afficher les parents et enfants filtrés
    console.log('Commentaires parents :', parentComments);
    console.log('Commentaires enfants :', childComments);

    return (
        <div className="mt-6 px-2">
            <h3 className="text-lg font-semibold text-text dark:text-dark mb-4">Commentaires</h3>
            <div className="space-y-2">
                {parentComments.length === 0 ? (
                    <p className="text-sm text-neutral-500">Aucun commentaire pour l&#39;instant.</p>
                ) : (
                    parentComments.map((comment) => (
                        <div key={comment.idComment}>
                            <CommentItem
                                comment={comment}
                                onReply={handleCreateReply}
                                onDelete={handleDeleteComment}
                            />
                            {childComments
                                .filter((child) => child.parentId === comment.idComment)
                                .map((child: CommentDTO) => (
                                    <CommentItem
                                        key={child.idComment}
                                        comment={child}
                                        onReply={handleCreateReply}
                                        onDelete={handleDeleteComment}
                                        level={1}
                                    />
                                ))}
                        </div>
                    ))
                )}
            </div>
            {parentComments.length > 0 && (
                <div className="sticky bottom-0 bg-white dark:bg-gray-900 p-3 border-t border-neutral-200 dark:border-neutral-700">
                    <CommentInput onSubmit={handleCreateComment} />
                </div>
            )}
            {parentComments.length === 0 && <CommentInput onSubmit={handleCreateComment} />}
        </div>
    );
}