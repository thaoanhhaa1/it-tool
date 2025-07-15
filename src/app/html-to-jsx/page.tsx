import HtmlToJsxConverter from '../../components/HtmlToJsxConverter';
import Navigation from '../../components/Navigation';

export default function HtmlToJsxPage() {
    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
            <Navigation />
            <HtmlToJsxConverter />
        </div>
    );
}
