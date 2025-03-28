export const fetchAPI = async (
    url: string,
    userToken: string,
    body: any = null
) => {
    const res = await fetch(url, {
        headers: {
            "X-Token": userToken,
            "Content-Type": "application/json",
        },
        method: body ? "POST" : "GET",
        body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json();
    return data;
};
