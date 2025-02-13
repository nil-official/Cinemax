const User = require('../models/userSchema');

const getAllUsers = async (req, res) => {
    if (req.user.role !== 'superadmin')
        return res.status(400).send({
            error: 'Only the god can see all the users!',
        });
    try {
        const users = await User.find({});
        res.send({ message: 'All users fetched successfully', users });
    } catch (e) {
        res.status(400).send({
            error: 'Could not fetch users at this time!',
        });
    }
};

const getUser = async (req, res) => {
    try {
        res.send(req.user);
    } catch (e) {
        res.status(400).send({
            error: "You're not logged in!",
        });
    }
};

const getUserById = async (req, res) => {
    if (req.user.role !== 'superadmin')
        return res.status(400).send({
            error: 'Only the god can see the user!',
        });
    const _id = req.params.id;
    try {
        const user = await User.findById(_id);
        if (!user) return res.sendStatus(404);
        res.send(user);
    } catch (e) {
        res.sendStatus(400);
    }
};

const updateUser = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'phone', 'username', 'email', 'password'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    if (!isValidOperation) return res.status(400).send({ error: 'Invalid updates!' });

    try {
        const { user } = req;
        updates.forEach((update) => (user[update] = req.body[update]));
        await user.save();
        res.send({
            message: 'User updated successfully',
            user,
        });
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
};

const updateUserById = async (req, res) => {
    if (req.user.role !== 'superadmin')
        return res.status(400).send({
            error: 'Only the god can update the user!',
        });
    const _id = req.params.id;

    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'phone', 'username', 'email', 'password', 'role'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) return res.status(400).send({ error: 'Invalid updates!' });

    try {
        const user = await User.findById(_id);
        updates.forEach((update) => (user[update] = req.body[update]));
        await user.save();

        if (!user) return res.sendStatus(404);
        res.send({
            message: 'User updated successfully',
            user,
        });
    } catch (e) {
        res.status(400).send({
            error: 'Could not update user at this time!',
        });
    }
};

const deleteUser = async (req, res) => {
    if (req.user.role !== 'superadmin')
        return res.status(400).send({
            error: 'You cannot delete yourself!',
        });
    try {
        await req.user.remove();
        res.send({
            message: 'User deleted successfully',
            user: req.user,
        });
    } catch (e) {
        res.sendStatus(400).send({
            error: 'Could not delete user at this time!',
        });
    }
};

const deleteUserById = async (req, res) => {
    if (req.user.role !== 'superadmin')
        return res.status(400).send({
            error: 'Only the god can delete the user!',
        });
    const _id = req.params.id;

    try {
        const user = await User.findByIdAndDelete(_id);
        if (!user) return res.sendStatus(404);

        res.send({
            message: 'User deleted successfully'
        });
    } catch (e) {
        res.sendStatus(400).send({
            error: 'Could not delete user at this time!',
        });
    }
};

const logoutUser = async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.user.save();
        res.send({
            message: 'You have been logged out!',
        });
    } catch (e) {
        res.status(400).send({
            error: 'You are not logged in!',
        });
    }
};

const logoutAll = async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send(
            {
                message: 'You have been logged out from all devices!',
            },
        );
    } catch (e) {
        res.status(400).send({
            error: 'You are not logged in!',
        });
    }
};

module.exports = {
    getAllUsers,
    getUser,
    getUserById,
    updateUser,
    updateUserById,
    deleteUser,
    deleteUserById,
    logoutUser,
    logoutAll,
};