import { useCallback, useEffect, useMemo, useState } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import TableToolbar from '../../components/ui/TableToolbar';
import PaginationFooter from '../../components/ui/PaginationFooter';
import DictionaryRow from '../../components/ui/DictionaryRow';
// import InputAutocomplete from '../../components/ui/fieldsUIAdmin/InputSelect/InputSelect.tsx';
// import { valueExpressionToString } from '../../components/ui/fieldsUIAdmin/InputSelect/parser.ts';
import { getDictionaries } from '../../api';

type DictionaryItem = {
    id: string;
    name: string;
    description?: string;
    groupId?: string;
};

type GroupItem = {
    id: string;
    name: string;
};

const GROUPS: GroupItem[] = [
    { id: '', name: 'Все' },
    { id: '1', name: 'Общие' },
    { id: '2', name: 'Страхование' },
    { id: '3', name: 'Финансы' },
];



export default function DictionariesPage() {
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(20);
    const [search, setSearch] = useState('');
    const [selectedGroupId, setSelectedGroupId] = useState('');

    const [items, setItems] = useState<DictionaryItem[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const totalPages = Math.max(1, Math.ceil(total / Math.max(1, size)));

    const loadDictionaries = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await getDictionaries({
                page,
                size,
                search: search.trim() || undefined,
            });

            setItems(res.data ?? []);
            setTotal(res.total ?? 0);
        } catch (err) {
            console.error('Failed to load dictionaries', err);
            setItems([]);
            setTotal(0);
            setError('Не удалось загрузить справочники');
        } finally {
            setLoading(false);
        }
    }, [page, size, search, selectedGroupId]);

    useEffect(() => {
        void loadDictionaries();
    }, [loadDictionaries]);

    const onClearSearch = () => {
        setSearch('');
        setPage(1);
    };

    const onRefresh = () => {
        // refetch()
        console.log('refresh');
    };

    const onChangeSize = (n: number) => {
        setSize(n);
        setPage(1);
    };

    const onDelete = (id: string) => {
        console.log('delete', id);
    };

    const onCopy = async (id: string) => {
        const url = `${window.location.origin}/api/dictionary-schema/${id}`;
        try {
            await navigator.clipboard.writeText(url);
            console.log('copied', url);
        } catch {
            console.log('copy failed');
        }
    };

    const pageItems = useMemo(() => items, [items]);

    return (
        <div className="d-flex flex-column w-100">
            <PageHeader
                title="Справочники"
                right={
                    <>
                        <a href="/dictionaries/groups" className="btn btn-outline-secondary btn-sm">
                            Группы
                        </a>

                        <a href="/dictionaries/create" className="btn btn-success btn-sm">
                            <i className="bi bi-plus-lg mr-1" />
                            Добавить справочник
                        </a>
                    </>
                }
            />

            <section className="content">
                <div className="container-fluid">
                    <div className="card card-outline card-primary">
                        <TableToolbar
                            title="Список справочников"
                            search={search}
                            onSearchChange={(v) => {
                                setSearch(v);
                                setPage(1);
                            }}
                            onClearSearch={onClearSearch}
                            size={size}
                            onSizeChange={onChangeSize}
                            onRefresh={onRefresh}
                            rightExtras={
                                <div className="d-flex align-items-center" style={{ gap: 8 }}>
                                    <span className="text-muted small">Группа:</span>

                                    <select
                                        className="form-control form-control-sm"
                                        style={{ width: 220 }}
                                        value={selectedGroupId}
                                        onChange={(e) => {
                                            setSelectedGroupId(e.target.value);
                                            setPage(1);
                                        }}
                                    >
                                        {GROUPS.map((g) => (
                                            <option key={g.id} value={g.id}>
                                                {g.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            }
                        />

                        <div className="card-body table-responsive p-0">
                            {loading ? (
                                <div className="p-3 text-muted">Загрузка...</div>
                            ) : error ? (
                                <div className="p-3 text-danger">{error}</div>
                            ) : pageItems.length === 0 ? (
                                <div className="p-3 text-muted">Справочников нет.</div>
                            ) : (
                                <table className="table table-hover text-nowrap mb-0">
                                    <thead>
                                    <tr>
                                        <th style={{ width: 70 }}>#</th>
                                        <th style={{ minWidth: 240 }}>Название</th>
                                        <th>Описание</th>
                                        <th style={{ width: 220 }}>Группа</th>
                                        <th style={{ width: 180 }} className="text-right">
                                            Действия
                                        </th>
                                    </tr>
                                    </thead>

                                    <tbody>
                                    {pageItems.map((it, i) => {
                                        const rowNumber = (page - 1) * size + i + 1;

                                        return (
                                            <DictionaryRow
                                                key={it.id}
                                                item={it}
                                                rowNumber={rowNumber}
                                                groups={GROUPS}
                                                onCopy={onCopy}
                                                onDelete={onDelete}
                                            />
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

                        {/*<div style={{ maxWidth: 400 }}>*/}
                        {/*    <InputAutocomplete*/}
                        {/*        referenceTypeMap={{}}*/}
                        {/*        placeholder="Пиши текст..."*/}
                        {/*        value={text}*/}
                        {/*        options={options}*/}
                        {/*        onChange={(ast, raw) => {*/}
                        {/*            console.log('onChange:', ast, raw, ast ? valueExpressionToString(ast) : '');*/}
                        {/*            setText(raw);*/}
                        {/*        }}*/}
                        {/*    />*/}
                        {/*    <div className="mt-3">*/}
                        {/*        <strong>Текущее значение:</strong>*/}
                        {/*        <pre className="mt-2 p-2 border rounded bg-light">{text}</pre>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                    </div>
                </div>
            </section>
        </div>
    );
}