export const fetchCategories = async (setCategories, setSessionExpired) => {
    try {
        const response = await fetch("http://localhost:8000/api/v1/categories", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        const data = await response.json();

        if (response.status === 401) {
            setSessionExpired(true);
        } else {
       
            const sortedCategories = (data.category || []).sort((a, b) =>
                a.name.localeCompare(b.name)
            );
            setCategories(sortedCategories);
        }
    } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
    }
};

export const fetchSizes = async (setSizes, setSessionExpired) => {
    try {
        const response = await fetch("http://localhost:8000/api/v1/sizes", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        const data = await response.json();

        if (response.status === 401) {
            setSessionExpired(true);
        } else {
            
            const sortedSizes = (data || []).sort((a, b) =>
                a.value.localeCompare(b.value)
            );
            setSizes(sortedSizes);
        }
    } catch (error) {
        console.error("Error fetching sizes:", error);
        setSizes([]);
    }
};

export const fetchColors = async (setColorsList, setSessionExpired) => {
    try {
        const response = await fetch("http://localhost:8000/api/v1/colors", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        const data = await response.json();

        if (response.status === 401) {
            setSessionExpired(true);
        } else {
          
            const sortedColors = (data || []).sort((a, b) =>
                a.name.localeCompare(b.name)
            );
            setColorsList(sortedColors);
        }
    } catch (error) {
        console.error("Error fetching colors:", error);
        setColorsList([]);
    }
};