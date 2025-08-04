import CurlConverterForm from './CurlConverterForm';

// Server-side rendered main component
export default function CurlConverter() {
    return (
        <main className='max-w-6xl mx-auto p-6 space-y-6'>
            <header className='text-center space-y-2'>
                <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100'>
                    Curl to Query/Mutation/API/Type Converter
                </h1>
                <p className='text-lg text-gray-600 dark:text-gray-400'>
                    Chuyển đổi curl command sang GraphQL query, mutation, REST
                    API và TypeScript types một cách dễ dàng và miễn phí
                </p>
                <p className='text-sm text-gray-500 dark:text-gray-500'>
                    Hỗ trợ headers, parameters, body data và nhiều format output
                    khác
                </p>
            </header>

            <CurlConverterForm />

            {/* SEO Content Section */}
            <section className='mt-12 prose dark:prose-invert max-w-none'>
                <h2 className='text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4'>
                    Hướng dẫn sử dụng Curl Converter
                </h2>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600 dark:text-gray-400'>
                    <div>
                        <h3 className='text-lg font-medium text-gray-900 dark:text-gray-100 mb-2'>
                            Tính năng chính
                        </h3>
                        <ul className='space-y-1 list-disc list-inside'>
                            <li>
                                Chuyển đổi curl sang GraphQL query và mutation
                            </li>
                            <li>Chuyển đổi curl sang REST API code</li>
                            <li>Chuyển đổi curl sang TypeScript types</li>
                            <li>Hỗ trợ headers và parameters</li>
                            <li>Copy kết quả vào clipboard dễ dàng</li>
                            <li>Hoàn toàn miễn phí và không cần đăng ký</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className='text-lg font-medium text-gray-900 dark:text-gray-100 mb-2'>
                            Cách sử dụng
                        </h3>
                        <ol className='space-y-1 list-decimal list-inside'>
                            <li>Nhập hoặc paste curl command vào ô input</li>
                            <li>
                                Chọn loại output mong muốn
                                (Query/Mutation/API/Type)
                            </li>
                            <li>Điều chỉnh các tùy chọn (nếu cần)</li>
                            <li>
                                Click &quot;Chuyển đổi&quot; để generate code
                            </li>
                            <li>Copy kết quả và sử dụng trong project</li>
                        </ol>
                    </div>
                </div>
            </section>

            {/* New Features Section */}
            <section className='mt-8 prose dark:prose-invert max-w-none'>
                <h2 className='text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4'>
                    Tính năng mới
                </h2>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600 dark:text-gray-400'>
                    <div className='bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700'>
                        <h3 className='text-lg font-medium text-gray-900 dark:text-gray-100 mb-2'>
                            🚀 Query Service
                        </h3>
                        <p className='text-sm'>
                            Tạo QueryService với Zod schema validation, hỗ trợ
                            React Query pattern
                        </p>
                    </div>
                    <div className='bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700'>
                        <h3 className='text-lg font-medium text-gray-900 dark:text-gray-100 mb-2'>
                            ⚡ Mutation Service
                        </h3>
                        <p className='text-sm'>
                            Tạo MutationService với type safety và automatic
                            cache invalidation
                        </p>
                    </div>
                    <div className='bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700'>
                        <h3 className='text-lg font-medium text-gray-900 dark:text-gray-100 mb-2'>
                            🔧 API Method
                        </h3>
                        <p className='text-sm'>
                            Tạo API methods với Axios, error handling và
                            TypeScript types
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}
