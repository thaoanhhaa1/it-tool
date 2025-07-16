'use client';

interface CopyButtonProps {
    code: string;
}

export default function CopyButton({ code }: CopyButtonProps) {
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            // Có thể thêm toast notification ở đây
            console.log('Code đã được copy!');
        } catch (err) {
            console.error('Không thể copy code:', err);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className='w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors'
        >
            📋 Copy Code
        </button>
    );
}
