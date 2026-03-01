import DataToExcelForm from '@/components/DataToExcelForm';
import Navigation from '@/components/Navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Data to Excel - Điền dữ liệu vào template Excel',
    description:
        'Lấy dữ liệu từ cURL hoặc JSON, tải template Excel và ánh xạ field để điền tự động. Chọn field từ danh sách hoặc nhập đường dẫn thủ công.',
    keywords: [
        'data to excel',
        'json to excel',
        'curl to excel',
        'excel template',
        'fill excel',
        'export to excel',
        'data mapping',
        'excel generator',
    ],
    openGraph: {
        title: 'Data to Excel - Điền dữ liệu vào template Excel',
        description:
            'Lấy dữ liệu từ cURL hoặc JSON, tải template Excel và ánh xạ field để điền tự động.',
        url: 'https://it-tool-two.vercel.app/data-to-excel',
    },
    alternates: {
        canonical: 'https://it-tool-two.vercel.app/data-to-excel',
    },
};

export default function DataToExcelPage() {
    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
            <Navigation />
            <main className='max-w-6xl mx-auto px-6 py-12'>
                <header className='text-center space-y-2'>
                    <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100'>
                        Data to Excel
                    </h1>
                    <p className='text-lg text-gray-600 dark:text-gray-400'>
                        Lấy dữ liệu từ cURL hoặc JSON, điền vào template Excel
                        qua ánh xạ field
                    </p>
                    <p className='text-sm text-gray-500 dark:text-gray-500'>
                        Chọn tên field từ dữ liệu hoặc nhập đường dẫn thủ công
                        (vd: profile.name) cho mỗi cột Excel
                    </p>
                </header>

                <DataToExcelForm />

                <section className='mt-8 prose dark:prose-invert max-w-none text-sm text-gray-600 dark:text-gray-400'>
                    <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3'>
                        Hướng dẫn sử dụng
                    </h2>
                    <ol className='list-decimal list-inside space-y-2'>
                        <li>
                            <strong>Nguồn dữ liệu:</strong> Dán JSON trực tiếp
                            hoặc nhập lệnh cURL để gọi API lấy dữ liệu
                        </li>
                        <li>
                            <strong>Template Excel:</strong> Tải lên file Excel
                            có header (dòng 1) chứa tên các cột
                        </li>
                        <li>
                            <strong>Ánh xạ cột:</strong> Với mỗi cột Excel, chọn
                            field tương ứng từ dropdown hoặc nhập đường dẫn như
                            profile.age, items.0.name
                        </li>
                        <li>
                            <strong>Tạo file:</strong> Nhấn &quot;Tạo file
                            Excel&quot; để tải xuống file đã điền dữ liệu
                        </li>
                    </ol>
                </section>
            </main>
        </div>
    );
}
