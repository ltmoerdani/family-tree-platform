import React, { useState } from 'react';
import { 
  Download, 
  FileImage, 
  FileText, 
  Printer,
  ChevronDown
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const ExportControls: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const exportAsImage = async (format: 'png' | 'jpg') => {
    setIsExporting(true);
    try {
      const reactFlowElement = document.querySelector('.react-flow') as HTMLElement;
      if (!reactFlowElement) return;

      const canvas = await html2canvas(reactFlowElement, {
        backgroundColor: '#ffffff',
        scale: 2, // Higher quality
        useCORS: true,
        allowTaint: true,
      });

      const link = document.createElement('a');
      link.download = `family-tree.${format}`;
      link.href = canvas.toDataURL(`image/${format}`, 0.9);
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportAsPDF = async () => {
    setIsExporting(true);
    try {
      const reactFlowElement = document.querySelector('.react-flow') as HTMLElement;
      if (!reactFlowElement) return;

      const canvas = await html2canvas(reactFlowElement, {
        backgroundColor: '#ffffff',
        scale: 1.5,
        useCORS: true,
        allowTaint: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('family-tree.pdf');
    } catch (error) {
      console.error('PDF export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  const handleDropdownClose = () => {
    setShowDropdown(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleDropdownToggle}
        disabled={isExporting}
        className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg shadow-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
        aria-label="Export family tree"
        aria-expanded={showDropdown}
        aria-haspopup="menu"
      >
        <Download className="w-4 h-4" />
        <span>{isExporting ? 'Exporting...' : 'Export'}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {showDropdown && (
        <>
          {/* Accessible backdrop button for closing dropdown */}
          <button 
            type="button"
            className="fixed inset-0 z-40 bg-transparent border-none outline-none cursor-default"
            onClick={handleDropdownClose}
            onKeyDown={handleKeyDown}
            aria-label="Close export menu"
            tabIndex={0}
          />
          <div 
            className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-2"
            role="menu"
            aria-label="Export options"
          >
            <button
              onClick={() => {
                exportAsImage('png');
                handleDropdownClose();
              }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center space-x-2"
              role="menuitem"
            >
              <FileImage className="w-4 h-4" />
              <span>Export as PNG</span>
            </button>
            
            <button
              onClick={() => {
                exportAsImage('jpg');
                handleDropdownClose();
              }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center space-x-2"
              role="menuitem"
            >
              <FileImage className="w-4 h-4" />
              <span>Export as JPG</span>
            </button>
            
            <button
              onClick={() => {
                exportAsPDF();
                handleDropdownClose();
              }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center space-x-2"
              role="menuitem"
            >
              <FileText className="w-4 h-4" />
              <span>Export as PDF</span>
            </button>
            
            <hr className="my-2" />
            
            <button
              onClick={() => {
                handlePrint();
                handleDropdownClose();
              }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center space-x-2"
              role="menuitem"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};