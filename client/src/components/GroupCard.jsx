import { Link } from 'react-router-dom';

const GroupCard = ({ group }) => {
  return (
    <Link to={`/group/${group._id}`}>
      <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition">
        <h3 className="text-lg font-semibold">{group.name}</h3>
        <p className="text-gray-600">Members: {group.members.map((m) => m.name).join(', ')}</p>
      </div>
    </Link>
  );
};

export default GroupCard;