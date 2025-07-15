import HtmlToJsxForm from './HtmlToJsxForm';

export default function HtmlToJsxConverter() {
    return (
        <div className='max-w-6xl mx-auto px-6 py-12'>
            {/* Static header section - server rendered */}
            <div className='text-center mb-12'>
                <h1 className='text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4'>
                    HTML to JSX Converter
                </h1>
                <p className='text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto'>
                    Chuyển đổi HTML thành JSX một cách nhanh chóng và chính xác.
                    Tự động chuyển đổi các thuộc tính HTML, SVG attributes,
                    style objects và self-closing tags.
                </p>
            </div>

            {/* Interactive form - client rendered */}
            <HtmlToJsxForm />

            {/* Static features section - server rendered */}
            <div className='mt-16 grid grid-cols-1 md:grid-cols-3 gap-8'>
                <div className='text-center'>
                    <div className='w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4'>
                        <span className='text-2xl'>🔄</span>
                    </div>
                    <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2'>
                        Chuyển đổi thuộc tính
                    </h3>
                    <p className='text-gray-600 dark:text-gray-400'>
                        Tự động chuyển đổi class → className, stroke-width →
                        strokeWidth và tất cả các thuộc tính HTML/SVG
                    </p>
                </div>
                <div className='text-center'>
                    <div className='w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4'>
                        <span className='text-2xl'>🎨</span>
                    </div>
                    <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2'>
                        Style objects
                    </h3>
                    <p className='text-gray-600 dark:text-gray-400'>
                        Chuyển đổi style strings thành JSX style objects với
                        camelCase properties
                    </p>
                </div>
                <div className='text-center'>
                    <div className='w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4'>
                        <span className='text-2xl'>⚡</span>
                    </div>
                    <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2'>
                        Self-closing tags
                    </h3>
                    <p className='text-gray-600 dark:text-gray-400'>
                        Tự động thêm / cho các thẻ self-closing như img, input,
                        br
                    </p>
                </div>
            </div>
        </div>
    );
}
