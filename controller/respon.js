const respon = (statusCode, data, message, res) => {
    res.status(statusCode).json({
        message: message,
        payload: data,
        metadata: {
            pref: "",
            next: "",
            current: "",
        }
    });
};

export default respon;