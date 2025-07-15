import InterfaceToZodConverter from '../../components/InterfaceToZodConverter';
import Navigation from '../../components/Navigation';

export default function InterfaceToZodPage() {
    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
            <Navigation />
            <InterfaceToZodConverter />
        </div>
    );
}
