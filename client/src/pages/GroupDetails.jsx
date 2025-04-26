import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const GroupDetails = () => {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [sharedWith, setSharedWith] = useState([]);

  useEffect(() => {
    fetchGroup();
    fetchExpenses();
  }, [id]);

  const fetchGroup = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/groups/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setGroup(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/expenses/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:5000/api/expenses',
        { title, amount: Number(amount), paidBy, sharedWith, groupId: id },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setTitle('');
      setAmount('');
      setPaidBy('');
      setSharedWith([]);
      fetchExpenses();
    } catch (err) {
      console.error(err);
    }
  };

  // Balance calculation logic
  const calculateBalances = () => {
    const balances = {};
    group?.members.forEach((member) => {
      balances[member._id] = { name: member.name, amount: 0 };
    });

    expenses.forEach((expense) => {
      const share = expense.amount / expense.sharedWith.length;
      expense.sharedWith.forEach((member) => {
        balances[member._id].amount -= share;
      });
      balances[expense.paidBy._id].amount += expense.amount;
    });

    return Object.values(balances);
  };

  if (!group) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">{group.name}</h1>
      <form onSubmit={handleAddExpense} className="mb-6">
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Expense Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-2 border rounded"
            required
          />
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="p-2 border rounded"
            required
          />
          <select
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
            className="p-2 border rounded"
            required
          >
            <option value="">Select Paid By</option>
            {group.members.map((member) => (
              <option key={member._id} value={member._id}>
                {member.name}
              </option>
            ))}
          </select>
          <div>
            <label className="block text-gray-700">Shared With</label>
            {group.members.map((member) => (
              <div key={member._id}>
                <input
                  type="checkbox"
                  value={member._id}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSharedWith([...sharedWith, member._id]);
                    } else {
                      setSharedWith(sharedWith.filter((id) => id !== member._id));
                    }
                  }}
                />
                <span className="ml-2">{member.name}</span>
              </div>
            ))}
          </div>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Add Expense
          </button>
        </div>
      </form>
      <h2 className="text-xl font-semibold mb-4">Expenses</h2>
      <div className="mb-6">
        {expenses.map((expense) => (
          <div key={expense._id} className="bg-white shadow p-4 rounded mb-2">
            <p>
              <strong>{expense.title}</strong>: ₹{expense.amount} (Paid by {expense.paidBy.name})
            </p>
            <p>Shared with: {expense.sharedWith.map((m) => m.name).join(', ')}</p>
          </div>
        ))}
      </div>
      <h2 className="text-xl font-semibold mb-4">Balances</h2>
      <div>
        {calculateBalances().map((balance) => (
          <p key={balance.name}>
            {balance.name}: {balance.amount > 0 ? `Owes ₹${balance.amount}` : `Is owed ₹${Math.abs(balance.amount)}`}
          </p>
        ))}
      </div>
    </div>
  );
};

export default GroupDetails;