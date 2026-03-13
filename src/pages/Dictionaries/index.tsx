import { useMemo, useState } from "react";
import PageHeader from "../../components/ui/PageHeader";
import TableToolbar from "../../components/ui/TableToolbar";
import PaginationFooter from "../../components/ui/PaginationFooter";
import DictionaryRow from "../../components/ui/DictionaryRow";
import InputAutocomplete from "../../components/ui/fieldsUIAdmin/InputSelect/InputSelect.tsx";

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
    { id: "", name: "Все" },
    { id: "1", name: "Общие" },
    { id: "2", name: "Страхование" },
    { id: "3", name: "Финансы" },
];

const MOCK_ITEMS: DictionaryItem[] = [
    {
        id: "1",
        name: "Справочник валют",
        description: "Список поддерживаемых валют",
        groupId: "3",
    },
    {
        id: "2",
        name: "Справочник регионов",
        description: "Регионы и области",
        groupId: "1",
    },
    {
        id: "3",
        name: "Статусы договоров",
        description: "Статусы страховых договоров",
        groupId: "2",
    },
    {
        id: "4",
        name: "Типы клиентов",
        description: "Физические и юридические лица",
        groupId: "1",
    },
    {
        id: "5",
        name: "Типы программ",
        description: "Категории страховых программ",
        groupId: "2",
    },
    {
        id: "6",
        name: "Банки",
        description: "Список банков-партнёров",
        groupId: "3",
    },
    {
        id: "7",
        name: "Справочник стран",
        description: "Страны мира",
        groupId: "1",
    },
    {
        id: "8",
        name: "Каналы продаж",
        description: "Онлайн, агент, отделение",
        groupId: "2",
    },
    {
        id: "9",
        name: "Платёжные статусы",
        description: "Успешно, ошибка, ожидание",
        groupId: "3",
    },
    {
        id: "10",
        name: "Виды документов",
        description: "Паспорт, ИНН, договор",
        groupId: "1",
    },
    {
        id: "11",
        name: "Риски",
        description: "Страховые риски",
        groupId: "2",
    },
    {
        id: "12",
        name: "Ставки",
        description: "Финансовые коэффициенты",
        groupId: "3",
    },
];

const options = [
    { label: "birthdate", value: "birthdate" },
    { label: "now()", value: "now()" },
    { label: "firstname", value: "firstname" },
    { label: "lastname", value: "lastname" },
    { label: "age", value: "age" },
    { label: "email", value: "email" },
    { label: "phone", value: "phone" },
    { label: "eq", value: "eq" },
    { label: "gt", value: "gt" },
    { label: "lt", value: "lt" },
];


export default function DictionariesPage() {
    const [text, setText] = useState("[bir");
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(20);
    const [search, setSearch] = useState("");
    const [selectedGroupId, setSelectedGroupId] = useState("");

    const filteredItems = useMemo(() => {
        const q = search.trim().toLowerCase();

        return MOCK_ITEMS.filter((item) => {
            const byGroup = !selectedGroupId || item.groupId === selectedGroupId;

            const bySearch =
                !q ||
                item.name.toLowerCase().includes(q) ||
                item.description?.toLowerCase().includes(q);

            return byGroup && bySearch;
        });
    }, [search, selectedGroupId]);

    const total = filteredItems.length;
    const totalPages = Math.max(1, Math.ceil(total / Math.max(1, size)));

    const pageItems = useMemo(() => {
        const start = (page - 1) * size;
        return filteredItems.slice(start, start + size);
    }, [filteredItems, page, size]);

    const onClearSearch = () => {
        setSearch("");
        setPage(1);
    };

    const onRefresh = () => {
        //refetch()
        console.log("refresh");
    };

    const onChangeSize = (n: number) => {
        setSize(n);
        setPage(1);
    };

    const onDelete = (id: string) => {
        console.log("delete", id);
    };

    const onCopy = async (id: string) => {
        const url = `${window.location.origin}/api/dictionary-schema/${id}`;
        try {
            await navigator.clipboard.writeText(url);
            console.log("copied", url);
        } catch {
            console.log("copy failed");
        }
    };

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
                            {pageItems.length === 0 ? (
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

                        <div style={{ maxWidth: 400 }}>
                            <InputAutocomplete
                                placeholder="Пиши текст..."
                                value={text}
                                options={options}
                                onChange={(ast, raw) => {
                                    console.log("onChange:", ast, raw);
                                    setText(raw);
                                }}
                            />
                            <div className="mt-3">
                                <strong>Текущее значение:</strong>
                                <pre className="mt-2 p-2 border rounded bg-light">{text}</pre>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}