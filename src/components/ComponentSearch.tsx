'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ComponentSearchProps {
    onSearch: (term: string) => void;
    onLibraryChange: (library: string) => void;
    onTagFilter: (tags: string[]) => void;
}

export default function ComponentSearch({
    onSearch,
    onLibraryChange,
    onTagFilter,
}: ComponentSearchProps) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [searchTerm, setSearchTerm] = useState(
        searchParams.get('search') || '',
    );
    const [selectedLibrary, setSelectedLibrary] = useState(
        searchParams.get('library') || '',
    );
    const [selectedTags, setSelectedTags] = useState<string[]>(
        searchParams.get('tags')?.split(',').filter(Boolean) || [],
    );

    // Available libraries
    const libraries = [
        'MUI',
        'Ant Design',
        'Chakra UI',
        'Custom',
        'Headless UI',
        'JavaScript',
        'TypeScript',
        'React',
        'Utility',
    ];

    // Popular tags
    const popularTags = [
        'button',
        'form',
        'input',
        'hook',
        'utility',
        'animation',
        'layout',
        'navigation',
        'modal',
        'table',
        'chart',
        'calendar',
        'upload',
        'validation',
        'api',
        'format',
        'currency',
        'date',
        'performance',
        'search',
    ];

    // Update URL with search parameters
    useEffect(() => {
        const params = new URLSearchParams();

        if (searchTerm) params.set('search', searchTerm);
        if (selectedLibrary) params.set('library', selectedLibrary);
        if (selectedTags.length > 0) params.set('tags', selectedTags.join(','));

        const queryString = params.toString();
        const newUrl = queryString
            ? `/code-library?${queryString}`
            : '/code-library';

        // Only update URL if it's different
        if (
            window.location.pathname + '?' + window.location.search !==
            newUrl
        ) {
            router.replace(newUrl, { scroll: false });
        }
    }, [searchTerm, selectedLibrary, selectedTags, router]);

    // Trigger callbacks when values change
    useEffect(() => {
        onSearch(searchTerm);
    }, [searchTerm, onSearch]);

    useEffect(() => {
        onLibraryChange(selectedLibrary);
    }, [selectedLibrary, onLibraryChange]);

    useEffect(() => {
        onTagFilter(selectedTags);
    }, [selectedTags, onTagFilter]);

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
    };

    const handleLibraryChange = (library: string) => {
        setSelectedLibrary(library);
    };

    const handleTagToggle = (tag: string) => {
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
        );
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setSelectedLibrary('');
        setSelectedTags([]);
        router.replace('/code-library');
    };

    return (
        <div className='bg-white rounded-lg shadow-sm border p-6 space-y-6'>
            {/* Search Input */}
            <div>
                <label
                    htmlFor='search'
                    className='block text-sm font-medium text-gray-700 mb-2'
                >
                    Tìm kiếm
                </label>
                <input
                    id='search'
                    type='text'
                    placeholder='Tìm kiếm components, functions, hooks...'
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
            </div>

            {/* Library Filter */}
            <div>
                <label
                    htmlFor='library'
                    className='block text-sm font-medium text-gray-700 mb-2'
                >
                    Thư viện
                </label>
                <select
                    id='library'
                    value={selectedLibrary}
                    onChange={(e) => handleLibraryChange(e.target.value)}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                >
                    <option value=''>Tất cả thư viện</option>
                    {libraries.map((library) => (
                        <option key={library} value={library}>
                            {library}
                        </option>
                    ))}
                </select>
            </div>

            {/* Tags Filter */}
            <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Tags phổ biến
                </label>
                <div className='flex flex-wrap gap-2'>
                    {popularTags.map((tag) => (
                        <button
                            key={tag}
                            onClick={() => handleTagToggle(tag)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                selectedTags.includes(tag)
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            #{tag}
                        </button>
                    ))}
                </div>
            </div>

            {/* Active Filters */}
            {(searchTerm || selectedLibrary || selectedTags.length > 0) && (
                <div>
                    <div className='flex items-center justify-between mb-2'>
                        <span className='text-sm font-medium text-gray-700'>
                            Bộ lọc đang áp dụng
                        </span>
                        <button
                            onClick={handleClearFilters}
                            className='text-sm text-blue-600 hover:text-blue-800'
                        >
                            Xóa tất cả
                        </button>
                    </div>
                    <div className='flex flex-wrap gap-2'>
                        {searchTerm && (
                            <span className='inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800'>
                                Search: &quot;{searchTerm}&quot;
                                <button
                                    onClick={() => handleSearchChange('')}
                                    className='ml-2 text-blue-600 hover:text-blue-800'
                                >
                                    ×
                                </button>
                            </span>
                        )}
                        {selectedLibrary && (
                            <span className='inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800'>
                                {selectedLibrary}
                                <button
                                    onClick={() => handleLibraryChange('')}
                                    className='ml-2 text-green-600 hover:text-green-800'
                                >
                                    ×
                                </button>
                            </span>
                        )}
                        {selectedTags.map((tag) => (
                            <span
                                key={tag}
                                className='inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800'
                            >
                                #{tag}
                                <button
                                    onClick={() => handleTagToggle(tag)}
                                    className='ml-2 text-purple-600 hover:text-purple-800'
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
