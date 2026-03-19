import { useMemo, useState } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import TableToolbar from '../../components/ui/TableToolbar';
import PaginationFooter from '../../components/ui/PaginationFooter';
import type { Program } from '../../api/types.ts';
import {FaCopy, FaPlus, FaTrash} from "react-icons/fa";

const MOCK_PROGRAMS: Program[] = [
    {
        id: 'program-1',
        name: 'ОСАГО Базовая',
        descriptor: 'Базовая программа расчёта ОСАГО для физических лиц',
    },
    {
        id: 'program-2',
        name: 'КАСКО Стандарт',
        descriptor: 'Программа страхования автомобиля с базовыми рисками',
    },
    {
        id: 'program-3',
        name: 'Ипотечное страхование',
        descriptor: 'Страхование жизни и недвижимости для ипотечных клиентов',
    },
    {
        id: 'program-4',
        name: 'Медицинская защита',
        descriptor: 'Программа добровольного медицинского страхования',
    },
    {
        id: 'program-5',
        name: 'Путешествия',
        descriptor: 'Страхование выезжающих за рубеж',
    },
    {
        id: 'program-6',
        name: 'Несчастный случай',
        descriptor: 'Программа страхования от несчастных случаев',
    },
    {
        id: 'program-7',
        name: 'Страхование квартиры',
        descriptor: 'Защита квартиры и имущества',
    },
    {
        id: 'program-8',
        name: 'Защита бизнеса',
        descriptor: 'Программа страхования малого и среднего бизнеса',
    },
    {
        id: 'program-9',
        name: 'Агро защита',
        descriptor: 'Страхование сельскохозяйственных рисков',
    },
    {
        id: 'program-10',
        name: 'Корпоративная медицина',
        descriptor: 'Медицинское страхование сотрудников компании',
    },
    {
        id: 'program-11',
        name: 'Грузоперевозки',
        descriptor: 'Страхование грузов и логистики',
    },
    {
        id: 'program-12',
        name: 'Финансовые гарантии',
        descriptor: 'Страхование финансовых обязательств и гарантий',
    },
];

export default function ProgramsPage() {
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(20);
    const [search, setSearch] = useState('');

    const filteredItems = useMemo(() => {
        const q = search.trim().toLowerCase();

        return MOCK_PROGRAMS.filter((item) => {
            return !q || item.name.toLowerCase().includes(q) || item.descriptor.toLowerCase().includes(q);
        });
    }, [search]);

    const total = filteredItems.length;
    const totalPages = Math.max(1, Math.ceil(total / Math.max(1, size)));

    const pageItems = useMemo(() => {
        const start = (page - 1) * size;
        return filteredItems.slice(start, start + size);
    }, [filteredItems, page, size]);

    const onClearSearch = () => {
        setSearch('');
        setPage(1);
    };

    const onRefresh = () => {
        console.log('refresh programs');
    };

    const onChangeSize = (n: number) => {
        setSize(n);
        setPage(1);
    };

    const onDelete = (id: string) => {
        console.log('delete program', id);
    };

    const onCopy = async (id: string) => {
        const url = `${window.location.origin}/programs/${id}`;

        try {
            await navigator.clipboard.writeText(url);
            console.log('copied', url);
        } catch {
            console.log('copy failed');
        }
    };

    return (
        <div className="d-flex flex-column w-100">
            <PageHeader
                title="Программы"
                right={
                    <a href="/programs/create" className="btn btn-success btn-sm">
                        <i className="bi bi-plus-lg mr-1" />
                        Добавить программу
                    </a>
                }
            />

            <section className="content">
                <div className="container-fluid">
                    <div className="card card-outline card-primary">
                        <TableToolbar
                            title="Список программ"
                            search={search}
                            onSearchChange={(v) => {
                                setSearch(v);
                                setPage(1);
                            }}
                            onClearSearch={onClearSearch}
                            size={size}
                            onSizeChange={onChangeSize}
                            onRefresh={onRefresh}
                        />

                        <div className="card-body table-responsive p-0">
                            {pageItems.length === 0 ? (
                                <div className="p-3 text-muted">Программ нет.</div>
                            ) : (
                                <table className="table table-hover text-nowrap mb-0">
                                    <thead>
                                    <tr>
                                        <th style={{ width: 70 }}>#</th>
                                        <th style={{ minWidth: 260 }}>Название</th>
                                        <th>Описание</th>
                                        <th style={{ width: 180 }} className="text-right">
                                            Действия
                                        </th>
                                    </tr>
                                    </thead>

                                    <tbody>
                                    {pageItems.map((item, index) => {
                                        const rowNumber = (page - 1) * size + index + 1;

                                        return (
                                            <tr key={item.id}>
                                                <td>{rowNumber}</td>

                                                <td>
                                                    <div className="font-weight-medium">{item.name}</div>
                                                    <div className="text-muted small">{item.id}</div>
                                                </td>

                                                <td>{item.descriptor || <span className="text-muted">—</span>}</td>

                                                <td className="text-right">
                                                    <div className="btn-group btn-group-sm">
                                                        <a
                                                            href={`/programs/${item.id}`}
                                                            className="btn btn-outline-primary"
                                                            title="Открыть"
                                                        >
                                                            <FaPlus />
                                                        </a>

                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-secondary"
                                                            title="Копировать ссылку"
                                                            onClick={() => void onCopy(item.id)}
                                                        >
                                                            <FaCopy />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-danger"
                                                            title="Удалить"
                                                            onClick={() => onDelete(item.id)}
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        <PaginationFooter
                            page={page}
                            size={size}
                            total={total}
                            countOnPage={pageItems.length}
                            onPageChange={(p) => setPage(Math.max(1, Math.min(totalPages, p)))}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}