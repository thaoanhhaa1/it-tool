import InterfaceJsonCompareForm from './InterfaceJsonCompareForm';

// Server-side rendered main component
export default function InterfaceJsonCompareConverter() {
    return (
        <main className='max-w-6xl mx-auto p-6 space-y-6'>
            <header className='text-center space-y-2'>
                <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100'>
                    Interface ↔ JSON Comparator
                </h1>
                <p className='text-lg text-gray-600 dark:text-gray-400'>
                    So sánh TypeScript interface với JSON để phát hiện field
                    thiếu/dư và sai kiểu dữ liệu
                </p>
                <p className='text-sm text-gray-500 dark:text-gray-500'>
                    Hỗ trợ so sánh nested objects/arrays, optional fields và báo
                    cáo khác biệt theo đường dẫn (path)
                </p>
            </header>

            <InterfaceJsonCompareForm />

            {/* SEO Content Section */}
            <section className='mt-12 prose dark:prose-invert max-w-none'>
                <h2 className='text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4'>
                    Hướng dẫn sử dụng Interface ↔ JSON Comparator
                </h2>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600 dark:text-gray-400'>
                    <div>
                        <h3 className='text-lg font-medium text-gray-900 dark:text-gray-100 mb-2'>
                            Tính năng chính
                        </h3>
                        <ul className='space-y-1 list-disc list-inside'>
                            <li>
                                Kiểm tra field tồn tại/không tồn tại giữa 2 bên
                            </li>
                            <li>
                                Phát hiện sai type (string/number/boolean/object/array/null)
                            </li>
                            <li>So sánh nested object theo path</li>
                            <li>Hỗ trợ optional fields (vd: `a?: string`)</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className='text-lg font-medium text-gray-900 dark:text-gray-100 mb-2'>
                            Cách sử dụng
                        </h3>
                        <ol className='space-y-1 list-decimal list-inside'>
                            <li>
                                Paste TypeScript interface (hoặc type dạng object)
                            </li>
                            <li>Paste JSON cần đối chiếu</li>
                            <li>Click &quot;So sánh&quot;</li>
                            <li>
                                Xem danh sách khác biệt và sửa interface/JSON
                            </li>
                        </ol>
                    </div>
                </div>
            </section>
        </main>
    );
}

