'use client';

import {
    categoryService,
    codeExampleService,
    Library,
    libraryService,
    Tag,
    tagService,
    Type,
    typeService,
} from '@/services/apiService';
import { ICategory } from '@/types/category/category.interface';
import { ICodeExample } from '@/types/codeExample/codeExample.interface';
import { useEffect, useState } from 'react';
import ComponentPreview from './ComponentPreview';

export default function CodeLibrary() {
    const [codeExamples, setCodeExamples] = useState<ICodeExample[]>([]);
    const [, setCategories] = useState<ICategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLibrary, setSelectedLibrary] = useState<string>('');
    const [selectedType, setSelectedType] = useState<string>('all');
    const [types, setTypes] = useState<Type[]>([]);
    const [libraries, setLibraries] = useState<Library[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');

    // Fetch data from APIs using services
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch categories, code examples, types, libraries and tags in parallel using services
                const [
                    categoriesData,
                    codeExamplesData,
                    typesData,
                    librariesData,
                    tagsData,
                ] = await Promise.all([
                    categoryService.getAll(),
                    codeExampleService.getAll({ limit: 50 }),
                    typeService.getActive(),
                    libraryService.getActive(),
                    tagService.getActive(),
                ]);

                setCategories(categoriesData || []);
                setCodeExamples(codeExamplesData || []);
                setTypes(typesData || []);
                setLibraries(librariesData || []);
                setTags(tagsData || []);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(
                    'Không thể tải dữ liệu. Vui lòng kiểm tra kết nối và thử lại.',
                );
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Handle search and filter updates
    const handleSearch = async (newFilters: {
        search?: string;
        type?: string;
        library?: string;
        category?: string;
    }) => {
        try {
            setLoading(true);
            const filters: Record<string, unknown> = { limit: 50 };

            if (newFilters.search) filters.search = newFilters.search;
            if (newFilters.type) filters.type = newFilters.type;
            if (newFilters.library) filters.library = newFilters.library;
            if (newFilters.category) filters.category = newFilters.category;

            const codeExamplesData = await codeExampleService.getAll(filters);

            setCodeExamples(codeExamplesData || []);
        } catch (err) {
            console.error('Error searching:', err);
            setError('Lỗi khi tìm kiếm. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    // Debounced search effect
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const filters = {
                search: searchTerm,
                type: selectedType !== 'all' ? selectedType : undefined,
                library: selectedLibrary || undefined,
                category: selectedCategory || undefined,
            };

            handleSearch(filters);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchTerm, selectedType, selectedLibrary, selectedCategory]);

    // Filter examples locally for immediate feedback
    const filteredExamples = codeExamples.filter((example) => {
        const matchesSearch =
            !searchTerm ||
            example.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            example.description
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            example.tags.some((tag) =>
                tag.name.toLowerCase().includes(searchTerm.toLowerCase()),
            );

        const matchesLibrary =
            !selectedLibrary || example.library.name === selectedLibrary;
        const matchesType =
            selectedType === 'all' || example.type.code === selectedType;
        // const matchesCategory =
        //     !selectedCategory || example.category === selectedCategory;

        return matchesSearch && matchesLibrary && matchesType;
    });

    const handleRetry = () => {
        setError(null);
        window.location.reload();
    };

    if (loading && codeExamples.length === 0) {
        return (
            <div className='space-y-8'>
                <div className='text-center space-y-4'>
                    <h1 className='text-4xl font-bold text-gray-900'>
                        Code Library
                    </h1>
                    <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
                        Chia sẻ và khám phá các React Components và JavaScript
                        Functions hữu ích được xây dựng với các thư viện UI phổ
                        biến
                    </p>
                </div>
                <div className='text-center py-12'>
                    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
                    <p className='text-gray-600 mt-4'>Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    if (error && codeExamples.length === 0) {
        return (
            <div className='space-y-8'>
                <div className='text-center space-y-4'>
                    <h1 className='text-4xl font-bold text-gray-900'>
                        Code Library
                    </h1>
                    <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
                        Chia sẻ và khám phá các React Components và JavaScript
                        Functions hữu ích được xây dựng với các thư viện UI phổ
                        biến
                    </p>
                </div>
                <div className='text-center py-12'>
                    <div className='text-red-500 text-lg'>{error}</div>
                    <button
                        onClick={handleRetry}
                        className='mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className='space-y-8'>
            {/* Header */}
            <div className='text-center space-y-4'>
                <h1 className='text-4xl font-bold text-gray-900'>
                    Code Library
                </h1>
                <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
                    Chia sẻ và khám phá các React Components và JavaScript
                    Functions hữu ích được xây dựng với các thư viện UI phổ biến
                </p>
            </div>

            {/* Search and Filters */}
            <div className='bg-white rounded-lg border border-gray-200 p-6 space-y-4'>
                {/* Search */}
                <div>
                    <input
                        type='text'
                        placeholder='Tìm kiếm components hoặc functions...'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    />
                </div>

                {/* Filters */}
                <div className='flex flex-wrap gap-4'>
                    {/* Type Filter */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                            Loại
                        </label>
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className='px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        >
                            <option value='all'>Tất cả</option>
                            {types.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Library Filter */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                            Thư viện
                        </label>
                        <select
                            value={selectedLibrary}
                            onChange={(e) => setSelectedLibrary(e.target.value)}
                            className='px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        >
                            <option value=''>Tất cả thư viện</option>
                            {libraries.map((library) => (
                                <option key={library.id} value={library.id}>
                                    {library.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Category Filter */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                            Danh mục
                        </label>
                        <select
                            value={selectedCategory}
                            onChange={(e) =>
                                setSelectedCategory(e.target.value)
                            }
                            className='px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        >
                            <option value=''>Tất cả danh mục</option>
                            {tags.map((tag) => (
                                <option key={tag.id} value={tag.id}>
                                    {tag.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Active Filters Display */}
                <div className='flex flex-wrap gap-2'>
                    {selectedType !== 'all' && (
                        <span className='inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800'>
                            {types.find((type) => type.id === selectedType)
                                ?.name || selectedType}
                            <button
                                onClick={() => setSelectedType('all')}
                                className='ml-2 text-blue-600 hover:text-blue-800'
                            >
                                ×
                            </button>
                        </span>
                    )}
                    {selectedLibrary && (
                        <span className='inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800'>
                            {libraries.find((lib) => lib.id === selectedLibrary)
                                ?.name || selectedLibrary}
                            <button
                                onClick={() => setSelectedLibrary('')}
                                className='ml-2 text-green-600 hover:text-green-800'
                            >
                                ×
                            </button>
                        </span>
                    )}
                    {selectedCategory && (
                        <span className='inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800'>
                            {
                                tags.find((tag) => tag.id === selectedCategory)
                                    ?.name
                            }
                            <button
                                onClick={() => setSelectedCategory('')}
                                className='ml-2 text-purple-600 hover:text-purple-800'
                            >
                                ×
                            </button>
                        </span>
                    )}
                </div>

                {/* Loading indicator for search */}
                {loading && codeExamples.length > 0 && (
                    <div className='text-center py-2'>
                        <div className='inline-flex items-center text-blue-600'>
                            <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2'></div>
                            Đang tìm kiếm...
                        </div>
                    </div>
                )}
            </div>

            {/* Results Count */}
            <div className='text-gray-600'>
                Hiển thị {filteredExamples.length} kết quả
                {searchTerm && ` cho "${searchTerm}"`}
            </div>

            {/* Examples Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {filteredExamples.map((example) => (
                    <ComponentPreview key={example.id} example={example} />
                ))}
            </div>

            {/* No Results */}
            {filteredExamples.length === 0 && !loading && (
                <div className='text-center py-12'>
                    <div className='text-gray-500 text-lg'>
                        Không tìm thấy kết quả phù hợp
                    </div>
                    <p className='text-gray-400 mt-2'>
                        Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
                    </p>
                </div>
            )}

            {/* Error display for search errors */}
            {error && codeExamples.length > 0 && (
                <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                    <div className='text-red-700'>{error}</div>
                </div>
            )}
        </div>
    );
}

// Export types for use in other components
export type { ICodeExample };
