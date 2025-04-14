/*
================================== LICENCIA ==============
====================================
MIT License
Copyright (c) 2025 José Bernardo Barquero Bonilla,
Jimmy Feng Feng,
Alexander Montero Vargas
Adrian Muñoz Alvarado,
Diego Salas Ovares.
Consulta el archivo LICENSE para más detalles.
=======================================================
=======================================
*/

/**
 * Component: ReporteMoraTable
 * Tabla para mostrar el reporte de clientes en mora, incluyendo cuotas vencidas y monto adeudado.
 *
 * Props:
 * - Ninguna (la tabla es estática y no recibe props en esta versión).
 *
 * Example:
 * <ReporteMoraTable />
 */

import { useEffect, useState } from 'react';
import { API_ENDPOINT } from '@/config/api';
import jsPDF from 'jspdf';

// Define the Mora type
type Mora = {
  id_mora: number;
  cuotas_vencidas: number;
  monto_adeudado: number;
  cedula: string;
  nombre_completo: string;
  id_prestamo: number;
};

const ReporteMoraTable = () => {
  const [moras, setMoras] = useState<Mora[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMoras = async () => {
      try {
        const response = await fetch(`${API_ENDPOINT}Mora`, { method: 'GET' });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Mora[] = await response.json();
        setMoras(data);
      } catch (error) {
        console.error('Error fetching mora data:', error);
        setError('Failed to fetch mora data. Please try again later.');
      }
    };

    fetchMoras();
  }, []);

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text('Reporte de Clientes en Mora', 14, 20);
    
    // Add date
    doc.setFontSize(12);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Table headers
    const headers = ['Cliente', 'Cédula', 'Préstamo', 'Cuotas', 'Monto'];
    let y = 40;
    
    // Add headers
    doc.setFontSize(10);
    headers.forEach((header, i) => {
      doc.text(header, 14 + (i * 35), y);
    });
    
    // Add data rows
    moras.forEach((mora, index) => {
      y += 10;
      if (y > 280) { // Add new page if near bottom
        doc.addPage();
        y = 20;
      }
      
      doc.text(mora.nombre_completo.substring(0, 18), 14, y);
      doc.text(mora.cedula, 49, y);
      doc.text(`#${mora.id_prestamo}`, 84, y);
      doc.text(mora.cuotas_vencidas.toString(), 119, y);
      doc.text(`₡${mora.monto_adeudado.toLocaleString()}`, 154, y);
    });
    
    // Save PDF
    doc.save('reporte-mora.pdf');
  };

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div>
      <button className="btn btn-outline-info mb-3" onClick={generatePDF}>
        Generar Reporte
      </button>
      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>Cliente</th>
            <th>Cédula</th>
            <th>Préstamo</th>
            <th>Cuotas vencidas</th>
            <th>Monto adeudado</th>
          </tr>
        </thead>
        <tbody>
          {moras.map((mora) => (
            <tr key={mora.id_mora}>
              <td>{mora.nombre_completo}</td>
              <td>{mora.cedula}</td>
              <td>#{mora.id_prestamo}</td>
              <td>{mora.cuotas_vencidas}</td>
              <td>₡{mora.monto_adeudado.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReporteMoraTable;
