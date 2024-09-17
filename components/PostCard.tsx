const PostCard = ({ post }: any) => {
  const { userId, title, body } = post;

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 mb-4 border border-gray-200">
      <div className="flex items-center">
        <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 text-xl font-semibold">
          {userId}
        </div>
        <div className="ml-4">
          <p className="text-md text-gray-700 font-bold">{title}</p>
        </div>
      </div>
      <p className="text-sm text-gray-600 mt-2">{body}</p>
    </div>
  );
};

export default PostCard;
