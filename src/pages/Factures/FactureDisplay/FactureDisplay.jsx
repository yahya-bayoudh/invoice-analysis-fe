import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

function FactureDisplay() {
    const { id } = useParams();
    const [facture, setFacture] = useState(null);

    useEffect(() => {
        const fetchFacture = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/invoices/${id}`);
                setFacture(response.data);
            }
            catch (error) {
                console.error('Erreur lors de la récupération de la facture:', error);
            }
        };
        fetchFacture();
    }, [id]);

    return (
        <div>
            <img src={facture?.filePath} alt="Facture" />
        </div>
    );
}

export default FactureDisplay;