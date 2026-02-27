/**
 * SignaturePad — Canvas-based signature capture component.
 *
 * Features:
 *   - Mouse + touch support
 *   - Exports signature as PNG base64
 *   - Clear / reset button
 *   - Responsive canvas sizing
 *   - Follows GlideX visual style
 */

import { useRef, useEffect, useState, useCallback } from 'react';

interface SignaturePadProps {
    onSignatureChange: (signatureBase64: string | null) => void;
}

export default function SignaturePad({ onSignatureChange }: SignaturePadProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const isDrawingRef = useRef(false);
    const lastPointRef = useRef<{ x: number; y: number } | null>(null);
    const [hasSignature, setHasSignature] = useState(false);

    // Resize canvas to fill container
    const resizeCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const rect = container.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;

        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.scale(dpr, dpr);
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.lineWidth = 2.5;
            ctx.strokeStyle = '#111111';
        }
    }, []);

    useEffect(() => {
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        return () => window.removeEventListener('resize', resizeCanvas);
    }, [resizeCanvas]);

    // Get point coordinates relative to canvas
    const getPoint = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        const rect = canvas.getBoundingClientRect();
        let clientX: number, clientY: number;

        if ('touches' in e) {
            const touch = e.touches[0] || e.changedTouches[0];
            clientX = touch.clientX;
            clientY = touch.clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        return {
            x: clientX - rect.left,
            y: clientY - rect.top,
        };
    };

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        isDrawingRef.current = true;
        const point = getPoint(e);
        lastPointRef.current = point;

        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
        }
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        if (!isDrawingRef.current) return;

        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;

        const point = getPoint(e);
        const lastPoint = lastPointRef.current;

        if (lastPoint) {
            ctx.beginPath();
            ctx.moveTo(lastPoint.x, lastPoint.y);
            ctx.lineTo(point.x, point.y);
            ctx.stroke();
        }

        lastPointRef.current = point;
    };

    const stopDrawing = () => {
        if (isDrawingRef.current) {
            isDrawingRef.current = false;
            lastPointRef.current = null;
            setHasSignature(true);
            exportSignature();
        }
    };

    const exportSignature = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const dataUrl = canvas.toDataURL('image/png');
        onSignatureChange(dataUrl);
    };

    const clearSignature = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        setHasSignature(false);
        onSignatureChange(null);

        // Re-apply styles after clear
        resizeCanvas();
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                    Your Signature
                </label>
                {hasSignature && (
                    <button
                        type="button"
                        onClick={clearSignature}
                        className="text-xs font-medium text-red-500 hover:text-red-700 transition-colors"
                    >
                        Clear
                    </button>
                )}
            </div>

            <div
                ref={containerRef}
                className="relative w-full h-40 sm:h-48 border-2 border-dashed border-gray-300 rounded-xl bg-white cursor-crosshair overflow-hidden transition-colors hover:border-gray-400 focus-within:border-[#D7A04D]"
            >
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 touch-none"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    onTouchCancel={stopDrawing}
                />
                {!hasSignature && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <p className="text-sm text-gray-400 select-none">
                            Draw your signature here
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
