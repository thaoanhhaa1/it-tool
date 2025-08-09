import JsonToInterfaceZodForm from './JsonToInterfaceZodForm';

// Server-side rendered main component
export default function JsonToInterfaceZodConverter() {
    return (
        <main className='max-w-6xl mx-auto p-6 space-y-6'>
            <header className='text-center space-y-2'>
                <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100'>
                    JSON to Interface & Zod Schema Converter
                </h1>
                <p className='text-lg text-gray-600 dark:text-gray-400'>
                    Chuyển đổi JSON thành TypeScript interface và Zod schema
                    cùng lúc một cách dễ dàng và miễn phí
                </p>
                <p className='text-sm text-gray-500 dark:text-gray-500'>
                    Hỗ trợ nested objects, arrays, optional fields, camelCase
                    formatting và tạo validation schema hoàn chỉnh
                </p>
            </header>

            <JsonToInterfaceZodForm />

            {/* SEO Content Section */}
            <section className='mt-12 prose dark:prose-invert max-w-none'>
                <h2 className='text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4'>
                    Hướng dẫn sử dụng JSON to Interface & Zod Schema Converter
                </h2>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600 dark:text-gray-400'>
                    <div>
                        <h3 className='text-lg font-medium text-gray-900 dark:text-gray-100 mb-2'>
                            Tính năng chính
                        </h3>
                        <ul className='space-y-1 list-disc list-inside'>
                            <li>
                                Chuyển đổi JSON sang TypeScript interface và Zod
                                schema cùng lúc
                            </li>
                            <li>Hỗ trợ nested objects và arrays phức tạp</li>
                            <li>
                                Tùy chọn camelCase formatting cho properties
                            </li>
                            <li>Tự động phát hiện và xử lý optional fields</li>
                            <li>Tạo runtime validation với Zod schema</li>
                            <li>
                                Copy từng kết quả riêng biệt hoặc cả hai cùng
                                lúc
                            </li>
                            <li>Hoàn toàn miễn phí và không cần đăng ký</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className='text-lg font-medium text-gray-900 dark:text-gray-100 mb-2'>
                            Cách sử dụng
                        </h3>
                        <ol className='space-y-1 list-decimal list-inside'>
                            <li>Nhập hoặc paste JSON vào ô input</li>
                            <li>Đặt tên cho interface và schema</li>
                            <li>Chọn các tùy chọn formatting (nếu cần)</li>
                            <li>
                                Click &quot;Chuyển đổi&quot; để generate cả
                                interface và schema
                            </li>
                            <li>Copy kết quả và sử dụng trong project</li>
                            <li>Import zod để sử dụng runtime validation</li>
                        </ol>
                    </div>
                </div>

                <div className='mt-8'>
                    <h3 className='text-lg font-medium text-gray-900 dark:text-gray-100 mb-2'>
                        Lợi ích của việc kết hợp Interface và Zod Schema
                    </h3>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600 dark:text-gray-400'>
                        <div>
                            <h4 className='font-medium text-gray-800 dark:text-gray-200 mb-1'>
                                TypeScript Interface
                            </h4>
                            <ul className='space-y-1 list-disc list-inside'>
                                <li>Type safety tại compile time</li>
                                <li>IntelliSense và autocompletion</li>
                                <li>Documentation cho API</li>
                                <li>Refactoring an toàn</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className='font-medium text-gray-800 dark:text-gray-200 mb-1'>
                                Zod Schema
                            </h4>
                            <ul className='space-y-1 list-disc list-inside'>
                                <li>Runtime validation</li>
                                <li>Parsing và transformation</li>
                                <li>Error handling chi tiết</li>
                                <li>API input validation</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
