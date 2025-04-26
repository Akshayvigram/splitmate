import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import GroupCard from '../components/GroupCard';

const Dashboard = () => {
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [members, setMembers] = useState('');
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/login');
    fetchGroups();
  }, [user, navigate]);

  const fetchGroups = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/groups/${user._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setGroups(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      const memberIds = members.split(','); // Assuming members are comma-separated user IDs
      await axios.post(
        'http://localhost:5000/api/groups',
        { name: groupName, members: memberIds },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setGroupName('');
      setMembers('');
      fetchGroups();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">SplitMate Dashboard</h1>
        <button onClick={logout} className="bg-red-500 text-white p-2 rounded">
          Logout
        </button>
      </div>
      <form onSubmit={handleCreateGroup} className="mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="p-2 border rounded flex-1"
            required
          />
          <input
            type="text"
            placeholder="Member IDs (comma-separated)"
            value={members}
            onChange={(e) => setMembers(e.target.value)}
            className="p-2 border rounded flex-1"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Create Group
          </button>
        </div>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((group) => (
          <GroupCard key={group._id} group={group} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;