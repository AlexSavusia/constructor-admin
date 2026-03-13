import { FaCopy, FaPen, FaPlus, FaTrash } from 'react-icons/fa';
import { IconBtn } from './IconBtn.tsx';

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

type DictionaryRowProps = {
    item: DictionaryItem;
    rowNumber: number;
    groups: GroupItem[];
    onCopy: (id: string) => void | Promise<void>;
    onDelete: (id: string) => void;
};

function getGroupName(groups: GroupItem[], groupId?: string) {
    return groups.find((x) => x.id === groupId)?.name ?? '-';
}

export default function DictionaryRow({ item, rowNumber, groups, onCopy, onDelete }: DictionaryRowProps) {
    return (
        <tr>
            <td className="text-muted">{rowNumber}</td>

            <td className="font-weight-medium">{item.name}</td>

            <td>{item.description?.trim() ? item.description : <span className="text-muted">—</span>}</td>

            <td>
                <span className="badge badge-light">{getGroupName(groups, item.groupId)}</span>
            </td>

            <td className="text-right">
                <div className="btn-group btn-group-sm">
                    <IconBtn title="Скопировать API" className="btn btn-outline-secondary" onClick={() => void onCopy(item.id)}>
                        <FaCopy />
                    </IconBtn>

                    <IconBtn
                        as="a"
                        href={`/dictionaries/${item.id}/rows/create`}
                        title="Добавить данные"
                        className="btn btn-outline-success"
                    >
                        <FaPlus />
                    </IconBtn>

                    <IconBtn
                        as="a"
                        href={`/dictionaries/${item.id}/edit`}
                        title="Редактировать"
                        className="btn btn-outline-primary"
                    >
                        <FaPen />
                    </IconBtn>

                    <IconBtn title="Удалить" className="btn btn-outline-danger" onClick={() => onDelete(item.id)}>
                        <FaTrash />
                    </IconBtn>
                </div>
            </td>
        </tr>
    );
}
