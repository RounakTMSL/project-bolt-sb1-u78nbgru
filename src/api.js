export const getUsers = async () => {
    const res = await fetch("http://localhost:5000/api/users");
    return res.json();
};

export const addUser = async (user) => {
    const res = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
    });
    return res.json();
};
