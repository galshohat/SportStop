const fetchColors = async (setColors, setLoading) => {
    try {
        const response = await fetch("http://localhost:8000/api/v1/colors", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });


        if (!response.ok) {
            throw new Error("Failed to fetch colors");
        }

        const colors = await response.json();

        const sortedColors = colors.sort((a, b) => a.name.localeCompare(b.name));

        setColors(sortedColors);
        setLoading(false);
    } catch (error) {
        console.error("Error fetching colors:", error);
        setLoading(false);
    }
};

export default fetchColors;