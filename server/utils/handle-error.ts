const handleError = (func: Function) => async (event: any) => {
    try {
        return await func(event);
    } catch (error: any) {
        // console.log("error ", error?.response?.data)
        return createError({
            status: error?.response?.status,
            message: error?.response?.data?.message,
        });
    }
};

export default handleError;