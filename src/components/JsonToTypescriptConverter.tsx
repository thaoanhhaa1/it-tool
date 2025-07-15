import JsonConverterForm from './JsonConverterForm';

// Server-side rendered main component
export default function JsonToTypescriptConverter() {
    return (
        <main className='max-w-6xl mx-auto p-6 space-y-6'>
            <header className='text-center space-y-2'>
                <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100'>
                    JSON to TypeScript Interface Converter
                </h1>
                <p className='text-lg text-gray-600 dark:text-gray-400'>
                    Chuyển đổi JSON thành TypeScript interface một cách dễ dàng
                    và miễn phí
                </p>
                <p className='text-sm text-gray-500 dark:text-gray-500'>
                    Hỗ trợ nested objects, arrays, camelCase formatting và nhiều
                    tùy chọn khác
                </p>
            </header>

            <JsonConverterForm />

            {/* SEO Content Section */}
            <section className='mt-12 prose dark:prose-invert max-w-none'>
                <h2 className='text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4'>
                    Hướng dẫn sử dụng JSON to TypeScript Converter
                </h2>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600 dark:text-gray-400'>
                    <div>
                        <h3 className='text-lg font-medium text-gray-900 dark:text-gray-100 mb-2'>
                            Tính năng chính
                        </h3>
                        <ul className='space-y-1 list-disc list-inside'>
                            <li>
                                Chuyển đổi JSON phức tạp sang TypeScript
                                interface
                            </li>
                            <li>Hỗ trợ nested objects và arrays</li>
                            <li>Tùy chọn camelCase formatting</li>
                            <li>Copy kết quả vào clipboard dễ dàng</li>
                            <li>Hoàn toàn miễn phí và không cần đăng ký</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className='text-lg font-medium text-gray-900 dark:text-gray-100 mb-2'>
                            Cách sử dụng
                        </h3>
                        <ol className='space-y-1 list-decimal list-inside'>
                            <li>Nhập hoặc paste JSON vào ô input</li>
                            <li>Đặt tên cho interface TypeScript</li>
                            <li>Chọn các tùy chọn formatting (nếu cần)</li>
                            <li>
                                Click &quot;Chuyển đổi&quot; để generate
                                interface
                            </li>
                            <li>Copy kết quả và sử dụng trong project</li>
                        </ol>
                    </div>
                </div>
            </section>
        </main>
    );
}
