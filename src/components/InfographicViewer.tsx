"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, Loader2, CheckCircle, Maximize, X } from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface InfographicViewerProps {
  htmlContent: string;
  title: string;
}

const InfographicViewer = ({ htmlContent, title }: InfographicViewerProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Simula o carregamento do iframe
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [htmlContent]);

  const handleDownload = async () => {
    if (!iframeRef.current || downloading) return;

    setDownloading(true);

    try {
      const iframeDocument = iframeRef.current.contentDocument;
      if (!iframeDocument) throw new Error("Iframe content not loaded.");

      // O elemento que queremos capturar é o body do iframe
      const targetElement = iframeDocument.body;

      // Adiciona um pequeno delay para garantir que todos os estilos estejam aplicados
      await new Promise(resolve => setTimeout(resolve, 100));

      // Usa html-to-image para converter o body do iframe
      const dataUrl = await htmlToImage.toPng(targetElement, {
        quality: 0.95,
        // Define a largura e altura baseadas no conteúdo do iframe para evitar cortes
        width: targetElement.scrollWidth,
        height: targetElement.scrollHeight,
      });

      // Cria um link de download
      const link = document.createElement('a');
      link.download = `${title.replace(/[^a-z0-9]/gi, '_')}_Infografico.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error('Erro ao gerar PNG:', error);
      // Aqui você poderia usar um toast para notificar o usuário sobre o erro
    } finally {
      setDownloading(false);
    }
  };

  const renderIframe = (height: string, isModal: boolean = false) => (
    <div 
      className={cn(
        "relative w-full border-4 border-purple-300 dark:border-purple-700 rounded-lg overflow-hidden shadow-2xl",
        height
      )}
      onMouseEnter={() => !isModal && setIsHovering(true)}
      onMouseLeave={() => !isModal && setIsHovering(false)}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 z-10">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        </div>
      )}
      <iframe
        ref={iframeRef}
        srcDoc={htmlContent}
        title={title}
        className={cn("w-full h-full border-none transition-opacity duration-500", loading ? 'opacity-0' : 'opacity-100')}
        onLoad={() => setLoading(false)}
        style={{ height: '100%', width: '100%' }}
      />

      {!isModal && (
        <button
          onClick={() => setIsExpanded(true)}
          className={cn(
            "absolute top-3 right-3 p-2 rounded-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-opacity duration-300",
            "text-purple-600 dark:text-purple-300 border border-purple-300 dark:border-purple-700",
            isHovering ? 'opacity-100' : 'opacity-0'
          )}
          aria-label="Expandir Infográfico"
        >
          <Maximize className="w-5 h-5" />
        </button>
      )}
    </div>
  );

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4 flex items-center text-purple-700 dark:text-purple-300">
        <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
        Infográfico Bônus: {title}
      </h3>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {renderIframe("h-[500px]")}
        </div>

        <div className="md:col-span-1 flex flex-col space-y-4">
          <Card className="p-4 bg-purple-50 dark:bg-purple-900/50 border-purple-200 dark:border-purple-700">
            <h4 className="font-semibold mb-2 text-purple-800 dark:text-purple-200">Sobre o Infográfico</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Este é um resumo visual (Sketchnote) dos principais conceitos que você revisou. Clique no ícone de expandir para ver em tela cheia ou baixe como PNG.
            </p>
          </Card>
          
          <Button 
            size="lg" 
            onClick={handleDownload} 
            disabled={loading || downloading}
            className="w-full bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/50"
          >
            {downloading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Preparando Download...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Baixar como PNG
              </>
            )}
          </Button>
          
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            A qualidade da imagem pode variar dependendo do navegador.
          </p>
        </div>
      </div>

      {/* Modal de Visualização Expandida */}
      <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
        <DialogContent className="max-w-7xl w-[95vw] h-[95vh] p-0">
          <DialogHeader className="p-4 border-b">
            <DialogTitle className="text-xl font-bold">{title} (Visualização Expandida)</DialogTitle>
          </DialogHeader>
          <div className="p-4 h-full overflow-y-auto">
            <iframe
              srcDoc={htmlContent}
              title={title}
              className="w-full h-full border-none"
              // Forçando o iframe a ter uma altura que permita a rolagem do conteúdo interno
              style={{ height: '100%', width: '100%', minHeight: '1000px' }} 
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InfographicViewer;