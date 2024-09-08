const fetchSizes = async (setSizes, setLoading) => {
    try {
        const response = await fetch('http://localhost:8000/api/v1/sizes', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });


        if (!response.ok) {
            throw new Error('Failed to fetch sizes');
        }

        const sizes = await response.json();
        
        const sortedSizes = sizes.sort((a, b) => a.name.localeCompare(b.name)); 
    
        setSizes(sortedSizes);
        setLoading(false);
    } catch (error) {
        console.error('Error fetching sizes:', error);
        setSizes([]);
        setLoading(false);
    }
};

export default fetchSizes;