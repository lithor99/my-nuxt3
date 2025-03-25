const useAsyncHandler = (fun?: Function) => async (data?: any) => {
    try {
        if (fun) {
            return await fun(data);
        }
    } catch (error) {
        return error;
    }
};

export default useAsyncHandler;