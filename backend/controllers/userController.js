const users = [];

const getUsers = (req, res) => {
    res.json(users);
};

const createUser = (req, res) => {
    const { name, email } = req.body;
    users.push({ name, email });
    res.status(201).json({ message: 'User created', user: { name, email } });
};

module.exports = { getUsers, createUser };
