import JsonToTypescriptConverter from '../../components/JsonToTypescriptConverter';
import Navigation from '../../components/Navigation';

export default function JsonToTypescriptPage() {
    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
            <Navigation />
            <JsonToTypescriptConverter />
        </div>
    );
}
