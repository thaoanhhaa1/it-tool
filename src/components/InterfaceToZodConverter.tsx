import InterfaceToZodForm from './InterfaceToZodForm';

// Server-side rendered main component
export default function InterfaceToZodConverter() {
    return (
        <main className='max-w-6xl mx-auto p-6 space-y-6'>
            <header className='text-center space-y-2'>
                <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100'>
                    TypeScript Interface to Zod Schema Converter
                </h1>
                <p className='text-lg text-gray-600 dark:text-gray-400'>
                    Chuyển đổi TypeScript interface thành Zod schema một cách dễ
                    dàng và miễn phí
                </p>
                <p className='text-sm text-gray-500 dark:text-gray-500'>
                    Hỗ trợ nested objects, arrays, optional fields và nhiều tùy
                    chọn khác
                </p>
            </header>

            <InterfaceToZodForm />

            {/* SEO Content Section */}
            <section className='mt-12 prose dark:prose-invert max-w-none'>
                <h2 className='text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4'>
                    Hướng dẫn sử dụng Interface to Zod Schema Converter
                </h2>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600 dark:text-gray-400'>
                    <div>
                        <h3 className='text-lg font-medium text-gray-900 dark:text-gray-100 mb-2'>
                            Tính năng chính
                        </h3>
                        <ul className='space-y-1 list-disc list-inside'>
                            <li>
                                Chuyển đổi TypeScript interface sang Zod schema
                            </li>
                            <li>Hỗ trợ nested objects và arrays</li>
                            <li>Tự động phát hiện optional fields</li>
                            <li>Copy kết quả vào clipboard dễ dàng</li>
                            <li>Hoàn toàn miễn phí và không cần đăng ký</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className='text-lg font-medium text-gray-900 dark:text-gray-100 mb-2'>
                            Cách sử dụng
                        </h3>
                        <ol className='space-y-1 list-decimal list-inside'>
                            <li>
                                Nhập hoặc paste TypeScript interface vào ô input
                            </li>
                            <li>Chọn các tùy chọn formatting (nếu cần)</li>
                            <li>
                                Click &quot;Chuyển đổi&quot; để generate Zod
                                schema
                            </li>
                            <li>Copy kết quả và sử dụng trong project</li>
                            <li>Import zod để sử dụng schema validation</li>
                        </ol>
                    </div>
                </div>
            </section>
        </main>
    );
}
