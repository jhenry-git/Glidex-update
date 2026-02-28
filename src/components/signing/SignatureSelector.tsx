/**
 * SignatureSelector — Multi-mode signature capture component.
 *
 * Three modes:
 *   1. Draw — canvas-based freehand drawing
 *   2. Type — name rendered in signature-style fonts
 *   3. Upload — image upload with preview
 *
 * Exports the final signature as a base64 PNG data URL.
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { Pen, Type, Upload, X, Check } from 'lucide-react';

type SignatureMode = 'draw' | 'typed' | 'uploaded';

interface SignatureSelectorProps {
    signerName: string;
    onSignatureChange: (signatureBase64: string | null, type: SignatureMode) => void;
}

// Signature-style fonts (using Google Fonts loaded inline)
const SIGNATURE_FONTS = [
    { name: 'Dancing Script', css: "'Dancing Script', cursive" },
    { name: 'Great Vibes', css: "'Great Vibes', cursive" },
    { name: 'Caveat', css: "'Caveat', cursive" },
    { name: 'Sacramento', css: "'Sacramento', cursive" },
];

const GOOGLE_FONTS_URL = `https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Great+Vibes&family=Caveat:wght@600&family=Sacramento&display=swap`;

export default function SignatureSelector({ signerName, onSignatureChange }: SignatureSelectorProps) {
    const [mode, setMode] = useState<SignatureMode>('draw');
    const [hasSignature, setHasSignature] = useState(false);

    // Load Google Fonts for typed signatures
    useEffect(() => {
        if (!document.querySelector(`link[href="${GOOGLE_FONTS_URL}"]`)) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = GOOGLE_FONTS_URL;
            document.head.appendChild(link);
        }
    }, []);

    const handleClear = () => {
        setHasSignature(false);
        onSignatureChange(null, mode);
    };

    const handleModeChange = (newMode: SignatureMode) => {
        setMode(newMode);
        setHasSignature(false);
        onSignatureChange(null, newMode);
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                    Your Signature
                </label>
                {hasSignature && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="text-xs font-medium text-red-500 hover:text-red-700 transition-colors flex items-center gap-1"
                    >
                        <X className="w-3 h-3" />
                        Clear
                    </button>
                )}
            </div>

            {/* Mode Tabs */}
            <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
                {([
                    { key: 'draw', label: 'Draw', icon: Pen },
                    { key: 'typed', label: 'Type', icon: Type },
                    { key: 'uploaded', label: 'Upload', icon: Upload },
                ] as const).map(({ key, label, icon: Icon }) => (
                    <button
                        key={key}
                        type="button"
                        onClick={() => handleModeChange(key)}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${mode === key
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <Icon className="w-3.5 h-3.5" />
                        {label}
                    </button>
                ))}
            </div>

            {/* Signature Capture Area */}
            {mode === 'draw' && (
                <DrawSignature
                    onSignatureChange={(sig) => {
                        setHasSignature(!!sig);
                        onSignatureChange(sig, 'draw');
                    }}
                />
            )}
            {mode === 'typed' && (
                <TypedSignature
                    signerName={signerName}
                    onSignatureChange={(sig) => {
                        setHasSignature(!!sig);
                        onSignatureChange(sig, 'typed');
                    }}
                />
            )}
            {mode === 'uploaded' && (
                <UploadSignature
                    onSignatureChange={(sig) => {
                        setHasSignature(!!sig);
                        onSignatureChange(sig, 'uploaded');
                    }}
                />
            )}
        </div>
    );
}

// ─── Draw Signature ────────────────────────────────────────────

function DrawSignature({
    onSignatureChange,
}: {
    onSignatureChange: (sig: string | null) => void;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const isDrawingRef = useRef(false);
    const lastPointRef = useRef<{ x: number; y: number } | null>(null);
    const [hasStrokes, setHasStrokes] = useState(false);

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
        return { x: clientX - rect.left, y: clientY - rect.top };
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
            setHasStrokes(true);
            const canvas = canvasRef.current;
            if (canvas) {
                onSignatureChange(canvas.toDataURL('image/png'));
            }
        }
    };

    useEffect(() => {
        if (!hasStrokes) {
            onSignatureChange(null);
        }
    }, [hasStrokes, onSignatureChange]);

    return (
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
            {!hasStrokes && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <p className="text-sm text-gray-400 select-none">
                        Draw your signature here
                    </p>
                </div>
            )}
        </div>
    );
}

// ─── Typed Signature ──────────────────────────────────────────

function TypedSignature({
    signerName,
    onSignatureChange,
}: {
    signerName: string;
    onSignatureChange: (sig: string | null) => void;
}) {
    const [selectedFont, setSelectedFont] = useState(0);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const displayName = signerName.trim() || 'Your Name';

    const renderToCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const w = 400;
        const h = 120;

        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
        ctx.scale(dpr, dpr);

        // Clear
        ctx.clearRect(0, 0, w, h);

        // Draw text
        const font = SIGNATURE_FONTS[selectedFont];
        ctx.font = `36px ${font.css}`;
        ctx.fillStyle = '#111111';
        ctx.textBaseline = 'middle';
        ctx.fillText(displayName, 20, h / 2);

        // Underline
        const textWidth = ctx.measureText(displayName).width;
        ctx.strokeStyle = '#D7A04D';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(20, h / 2 + 22);
        ctx.lineTo(20 + textWidth, h / 2 + 22);
        ctx.stroke();

        onSignatureChange(canvas.toDataURL('image/png'));
    }, [displayName, selectedFont, onSignatureChange]);

    useEffect(() => {
        // Wait for fonts to load
        const timer = setTimeout(renderToCanvas, 500);
        return () => clearTimeout(timer);
    }, [renderToCanvas]);

    return (
        <div className="space-y-3">
            {/* Font selector */}
            <div className="grid grid-cols-2 gap-2">
                {SIGNATURE_FONTS.map((font, i) => (
                    <button
                        key={font.name}
                        type="button"
                        onClick={() => setSelectedFont(i)}
                        className={`px-3 py-3 rounded-xl border-2 text-left transition-all duration-200 ${selectedFont === i
                                ? 'border-[#D7A04D] bg-[#D7A04D]/5'
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                    >
                        <span
                            className="text-xl text-gray-900 block truncate"
                            style={{ fontFamily: font.css }}
                        >
                            {displayName}
                        </span>
                        <span className="text-[10px] text-gray-400 mt-1 block">{font.name}</span>
                        {selectedFont === i && (
                            <div className="absolute top-1.5 right-1.5">
                                <Check className="w-3.5 h-3.5 text-[#D7A04D]" />
                            </div>
                        )}
                    </button>
                ))}
            </div>

            {/* Hidden canvas for rendering */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Preview */}
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 bg-gray-50/50 text-center">
                <p
                    className="text-3xl text-gray-900"
                    style={{ fontFamily: SIGNATURE_FONTS[selectedFont].css }}
                >
                    {displayName}
                </p>
                <p className="text-[10px] text-gray-400 mt-2">Signature preview</p>
            </div>
        </div>
    );
}

// ─── Upload Signature ─────────────────────────────────────────

function UploadSignature({
    onSignatureChange,
}: {
    onSignatureChange: (sig: string | null) => void;
}) {
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            return;
        }

        // Max 5MB
        if (file.size > 5 * 1024 * 1024) {
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            setPreview(result);
            onSignatureChange(result);
        };
        reader.readAsDataURL(file);
    };

    const handleRemove = () => {
        setPreview(null);
        onSignatureChange(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-3">
            {!preview ? (
                <label className="flex flex-col items-center justify-center w-full h-40 sm:h-48 border-2 border-dashed border-gray-300 rounded-xl bg-white cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-all duration-200">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 font-medium">
                        Click to upload signature
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        PNG, JPG, or SVG • Max 5MB
                    </p>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </label>
            ) : (
                <div className="relative border-2 border-gray-200 rounded-xl overflow-hidden bg-white">
                    <img
                        src={preview}
                        alt="Uploaded signature"
                        className="w-full h-40 sm:h-48 object-contain p-4"
                    />
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 border border-gray-200 flex items-center justify-center text-gray-500 hover:text-red-500 hover:border-red-200 transition-all shadow-sm"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}
        </div>
    );
}
