// import type { FormDefinition } from '../logic/type.ts';
//
// export const TEST: FormDefinition = {
//     firstStepKey: 'start',
//     steps: {
//         start: {
//             key: 'start',
//             title: 'First step',
//             fields: {
//                 '15c5848e-3d4f-4c34-be8b-3436578234fc': {
//                     capabilities: {
//                         canBeVisible: false,
//                         canBeEnabled: false,
//                         canBeRequired: false,
//                         canBeSetValue: false,
//                     },
//                     control: 'input',
//                     fieldType: 'input',
//                     valueType: 'unknown',
//                     logic: {
//                         visibility: {
//                             defaultValue: true,
//                             rule: {
//                                 condition: {
//                                     id: '49f15f84-bd2b-4219-8168-186ee8d9fa60',
//                                     type: 'noop',
//                                     items: [],
//                                 },
//                                 actions: [],
//                             },
//                         },
//                         enabled: {
//                             defaultValue: true,
//                             rule: {
//                                 condition: {
//                                     id: '6a3bd1f5-72ae-4e40-866c-bbd03f97a1d1',
//                                     type: 'noop',
//                                     items: [],
//                                 },
//                                 actions: [],
//                             },
//                         },
//                         required: {
//                             defaultValue: true,
//                             rule: {
//                                 condition: {
//                                     id: '7691cfb7-0605-4675-950f-ccff32265f3e',
//                                     type: 'noop',
//                                     items: [],
//                                 },
//                                 actions: [],
//                             },
//                         },
//                     },
//                     __typ: 'field',
//                     key: '15c5848e-3d4f-4c34-be8b-3436578234fc',
//                     descriptorKey: 'radio',
//                     settingsValues: {
//                         label: 'Тип рассчеиа',
//                         fieldType: 'radio',
//                         name: 'calcType',
//                         required: false,
//                         visible: false,
//                         disabled: false,
//                         theme: 'param',
//                         options: [
//                             {
//                                 label: 'По СС',
//                                 value: 'sum',
//                             },
//                             {
//                                 label: 'По премии',
//                                 value: 'premium',
//                             },
//                         ],
//                     },
//                     layout: {
//                         i: '15c5848e-3d4f-4c34-be8b-3436578234fc',
//                         x: 0,
//                         y: 0,
//                         w: 2,
//                         h: 3,
//                         minW: 1,
//                         moved: false,
//                         static: false,
//                         resizeHandles: ['n', 's', 'w', 'e'],
//                     },
//                 },
//                 'a671a831-1094-483c-b20f-8d7fbf86d80b': {
//                     capabilities: {
//                         canBeVisible: false,
//                         canBeEnabled: false,
//                         canBeRequired: false,
//                         canBeSetValue: false,
//                     },
//                     control: 'input',
//                     fieldType: 'input',
//                     valueType: 'unknown',
//                     logic: {
//                         visibility: {
//                             defaultValue: true,
//                             rule: {
//                                 condition: {
//                                     id: '3bbfbced-59f9-4018-b464-29a74b384a85',
//                                     type: 'noop',
//                                     items: [],
//                                 },
//                                 actions: [],
//                             },
//                         },
//                         enabled: {
//                             defaultValue: true,
//                             rule: {
//                                 condition: {
//                                     id: '6146319a-6076-49c3-a0b5-597a91ecf01b',
//                                     type: 'noop',
//                                     items: [],
//                                 },
//                                 actions: [],
//                             },
//                         },
//                         required: {
//                             defaultValue: true,
//                             rule: {
//                                 condition: {
//                                     id: '64a703a7-9867-417e-a432-dc1a4a996bd6',
//                                     type: 'noop',
//                                     items: [],
//                                 },
//                                 actions: [],
//                             },
//                         },
//                     },
//                     __typ: 'field',
//                     key: 'a671a831-1094-483c-b20f-8d7fbf86d80b',
//                     descriptorKey: 'radio',
//                     settingsValues: {
//                         label: 'Тип выплаты',
//                         fieldType: 'radio',
//                         name: 'paymentType',
//                         required: false,
//                         visible: false,
//                         disabled: false,
//                         theme: 'param',
//                         options: [
//                             {
//                                 label: 'Отложенная',
//                                 value: 'delayed',
//                             },
//                             {
//                                 label: 'Немедленная',
//                                 value: 'instant',
//                             },
//                         ],
//                     },
//                     layout: {
//                         i: 'a671a831-1094-483c-b20f-8d7fbf86d80b',
//                         x: 0,
//                         y: 3,
//                         w: 2,
//                         h: 3,
//                         minW: 1,
//                         moved: false,
//                         static: false,
//                         resizeHandles: ['n', 's', 'w', 'e'],
//                     },
//                 },
//                 'f1cf2101-9ef1-4dff-bfe8-8687884755e5': {
//                     capabilities: {
//                         canBeVisible: false,
//                         canBeEnabled: false,
//                         canBeRequired: false,
//                         canBeSetValue: false,
//                     },
//                     control: 'input',
//                     fieldType: 'input',
//                     valueType: 'unknown',
//                     logic: {
//                         visibility: {
//                             defaultValue: true,
//                             rule: {
//                                 condition: {
//                                     id: 'daa483d5-0223-44a9-9ddb-dd797fb55513',
//                                     type: 'noop',
//                                     items: [],
//                                 },
//                                 actions: [],
//                             },
//                         },
//                         enabled: {
//                             defaultValue: true,
//                             rule: {
//                                 condition: {
//                                     id: '28cc0744-22e9-4ff3-be9a-058d00f0b534',
//                                     type: 'noop',
//                                     items: [],
//                                 },
//                                 actions: [],
//                             },
//                         },
//                         required: {
//                             defaultValue: true,
//                             rule: {
//                                 condition: {
//                                     id: '96e517a9-2903-419f-892a-33928397e3f4',
//                                     type: 'noop',
//                                     items: [],
//                                 },
//                                 actions: [],
//                             },
//                         },
//                         validation: {
//                             condition: {
//                                 id: 'fdbf837e-1d57-4186-9bbe-e65af88b3e58',
//                                 type: 'and',
//                                 items: [
//                                     {
//                                         id: '2fa3c3ef-be2b-492e-a171-006dcb7774c8',
//                                         type: 'or',
//                                         items: [
//                                             {
//                                                 id: '0f7347be-967d-4f48-a2a7-ae9a064600d2',
//                                                 type: 'eq',
//                                                 left: {
//                                                     __typ: 'ref',
//                                                     path: ['start', 'fields', 'dddcaaaa-2c84-4812-a5ce-233b0f05f1ce'],
//                                                     refType: 'field',
//                                                 },
//                                                 right: {
//                                                     __typ: 'const',
//                                                     value: 1,
//                                                     valueType: 'number',
//                                                 },
//                                             },
//                                             {
//                                                 id: '9aaa5b3f-de0e-45da-bab4-3a41af6732f7',
//                                                 type: 'lt',
//                                                 left: {
//                                                     __typ: 'ref',
//                                                     path: ['start', 'fields', 'f1cf2101-9ef1-4dff-bfe8-8687884755e5'],
//                                                     refType: 'field',
//                                                 },
//                                                 right: {
//                                                     __typ: 'const',
//                                                     value: 5,
//                                                     valueType: 'number',
//                                                 },
//                                             },
//                                             {
//                                                 id: '5bef41a3-b727-4397-8339-56ae5f3149ad',
//                                                 type: 'gt',
//                                                 left: {
//                                                     __typ: 'ref',
//                                                     path: ['start', 'fields', 'f1cf2101-9ef1-4dff-bfe8-8687884755e5'],
//                                                     refType: 'field',
//                                                 },
//                                                 right: {
//                                                     __typ: 'const',
//                                                     value: 40,
//                                                     valueType: 'number',
//                                                 },
//                                             },
//                                         ],
//                                     },
//                                     {
//                                         id: '335e7f85-f343-486f-9dc4-2552749186df',
//                                         type: 'notEmpty',
//                                         item: {
//                                             __typ: 'ref',
//                                             path: ['start', 'fields', 'f1cf2101-9ef1-4dff-bfe8-8687884755e5'],
//                                             refType: 'field',
//                                         },
//                                         left: {
//                                             __typ: 'ref',
//                                             path: ['start', 'fields', 'f1cf2101-9ef1-4dff-bfe8-8687884755e5'],
//                                             refType: 'field',
//                                         },
//                                     },
//                                 ],
//                             },
//                             actions: [
//                                 {
//                                     type: 'setFieldError',
//                                     text: 'Диапазон 5 40s',
//                                 },
//                             ],
//                         },
//                     },
//                     __typ: 'field',
//                     key: 'f1cf2101-9ef1-4dff-bfe8-8687884755e5',
//                     descriptorKey: 'field',
//                     settingsValues: {
//                         mask: '',
//                         fieldType: 'input',
//                         label: 'Срок действия, лет',
//                         name: 'years',
//                         required: true,
//                         visible: false,
//                         disabled: false,
//                         placeholder: '',
//                         inputType: 'text',
//                         checked: false,
//                         options: [
//                             {
//                                 label: 'Вариант 1',
//                                 value: 'var1',
//                             },
//                             {
//                                 label: 'Вариант 2',
//                                 value: 'var2',
//                             },
//                         ],
//                         multiple: true,
//                         accept: 'jpg,jpeg,heic,png,pdf',
//                         maxFileSizeMb: '20',
//                     },
//                     layout: {
//                         i: 'f1cf2101-9ef1-4dff-bfe8-8687884755e5',
//                         x: 0,
//                         y: 6,
//                         w: 1,
//                         h: 3,
//                         minW: 1,
//                         moved: false,
//                         static: false,
//                         resizeHandles: ['n', 's', 'w', 'e'],
//                     },
//                 },
//                 'dddcaaaa-2c84-4812-a5ce-233b0f05f1ce': {
//                     capabilities: {
//                         canBeVisible: false,
//                         canBeEnabled: false,
//                         canBeRequired: false,
//                         canBeSetValue: false,
//                     },
//                     control: 'input',
//                     fieldType: 'input',
//                     valueType: 'unknown',
//                     logic: {
//                         visibility: {
//                             defaultValue: true,
//                             rule: {
//                                 condition: {
//                                     id: 'ab9c3342-7a31-43e2-9453-5e5ca2e3fc78',
//                                     type: 'noop',
//                                     items: [],
//                                 },
//                                 actions: [],
//                             },
//                         },
//                         enabled: {
//                             defaultValue: true,
//                             rule: {
//                                 condition: {
//                                     id: '586c772d-a251-4377-bfbf-834a7bd6dd90',
//                                     type: 'noop',
//                                     items: [],
//                                 },
//                                 actions: [],
//                             },
//                         },
//                         required: {
//                             defaultValue: true,
//                             rule: {
//                                 condition: {
//                                     id: '61756689-c1c5-45ce-80ab-e96af4158614',
//                                     type: 'noop',
//                                     items: [],
//                                 },
//                                 actions: [],
//                             },
//                         },
//                     },
//                     __typ: 'field',
//                     key: 'dddcaaaa-2c84-4812-a5ce-233b0f05f1ce',
//                     descriptorKey: 'field',
//                     settingsValues: {
//                         mask: '',
//                         fieldType: 'input',
//                         label: 'Срок уплаты взносов',
//                         name: 'paymentPeriod',
//                         required: true,
//                         visible: false,
//                         disabled: false,
//                         placeholder: '',
//                         inputType: 'text',
//                         checked: false,
//                         options: [
//                             {
//                                 label: 'Вариант 1',
//                                 value: 'var1',
//                             },
//                             {
//                                 label: 'Вариант 2',
//                                 value: 'var2',
//                             },
//                         ],
//                         multiple: true,
//                         accept: 'jpg,jpeg,heic,png,pdf',
//                         maxFileSizeMb: '20',
//                     },
//                     layout: {
//                         i: 'dddcaaaa-2c84-4812-a5ce-233b0f05f1ce',
//                         x: 1,
//                         y: 6,
//                         w: 1,
//                         h: 3,
//                         minW: 1,
//                         moved: false,
//                         static: false,
//                         resizeHandles: ['n', 's', 'w', 'e'],
//                     },
//                 },
//                 '7abf3482-cb8e-4542-909a-00c0b5597b8e': {
//                     capabilities: {
//                         canBeVisible: false,
//                         canBeEnabled: false,
//                         canBeRequired: false,
//                         canBeSetValue: false,
//                     },
//                     control: 'input',
//                     fieldType: 'input',
//                     valueType: 'unknown',
//                     logic: {
//                         visibility: {
//                             defaultValue: true,
//                             rule: {
//                                 condition: {
//                                     id: '5e8762de-9326-4911-ab6c-6074d14c318a',
//                                     type: 'noop',
//                                     items: [],
//                                 },
//                                 actions: [],
//                             },
//                         },
//                         enabled: {
//                             defaultValue: true,
//                             rule: {
//                                 condition: {
//                                     id: '9b0b78af-1337-4fca-9813-ff3c450dc3aa',
//                                     type: 'noop',
//                                     items: [],
//                                 },
//                                 actions: [],
//                             },
//                         },
//                         required: {
//                             defaultValue: true,
//                             rule: {
//                                 condition: {
//                                     id: '8858000d-61cd-48b0-a642-cc35f6d76310',
//                                     type: 'noop',
//                                     items: [],
//                                 },
//                                 actions: [],
//                             },
//                         },
//                         validation: {
//                             condition: {
//                                 id: '4859376d-9f34-498b-9fbc-125fd4fc481e',
//                                 type: 'and',
//                                 items: [
//                                     {
//                                         id: 'f0903dda-fb50-48d6-9a2e-c9fc13e76c96',
//                                         type: 'lte',
//                                         left: {
//                                             __typ: 'ref',
//                                             path: ['start', 'fields', '7abf3482-cb8e-4542-909a-00c0b5597b8e'],
//                                             refType: 'field',
//                                         },
//                                         right: {
//                                             __typ: 'const',
//                                             value: 100,
//                                             valueType: 'number',
//                                         },
//                                     },
//                                 ],
//                             },
//                             actions: [
//                                 {
//                                     type: 'setFieldError',
//                                     text: 'must be greater than 100',
//                                 },
//                             ],
//                         },
//                     },
//                     __typ: 'field',
//                     key: '7abf3482-cb8e-4542-909a-00c0b5597b8e',
//                     descriptorKey: 'field',
//                     settingsValues: {
//                         mask: '',
//                         fieldType: 'input',
//                         label: 'Страховая сумма',
//                         name: 'ins_sum',
//                         required: true,
//                         visible: false,
//                         disabled: false,
//                         placeholder: '',
//                         inputType: 'text',
//                         checked: false,
//                         options: [
//                             {
//                                 label: 'Вариант 1',
//                                 value: 'var1',
//                             },
//                             {
//                                 label: 'Вариант 2',
//                                 value: 'var2',
//                             },
//                         ],
//                         multiple: true,
//                         accept: 'jpg,jpeg,heic,png,pdf',
//                         maxFileSizeMb: '20',
//                     },
//                     layout: {
//                         i: '7abf3482-cb8e-4542-909a-00c0b5597b8e',
//                         x: 0,
//                         y: 9,
//                         w: 2,
//                         h: 3,
//                         minW: 1,
//                         moved: false,
//                         static: false,
//                         resizeHandles: ['n', 's', 'w', 'e'],
//                     },
//                 },
//                 'e295cf27-925a-47ef-821d-e1afd21207b9': {
//                     capabilities: {
//                         canBeVisible: false,
//                         canBeEnabled: false,
//                         canBeRequired: false,
//                         canBeSetValue: false,
//                     },
//                     control: 'input',
//                     fieldType: 'input',
//                     valueType: 'unknown',
//                     logic: {
//                         visibility: {
//                             defaultValue: true,
//                             rule: {
//                                 condition: {
//                                     id: 'f9c9cdf3-9023-4dc0-b1dc-cd032ede5767',
//                                     type: 'noop',
//                                     items: [],
//                                 },
//                                 actions: [],
//                             },
//                         },
//                         enabled: {
//                             defaultValue: true,
//                             rule: {
//                                 condition: {
//                                     id: '90cff997-935a-46ed-b66b-8ba89ac3c8f9',
//                                     type: 'noop',
//                                     items: [],
//                                 },
//                                 actions: [],
//                             },
//                         },
//                         required: {
//                             defaultValue: true,
//                             rule: {
//                                 condition: {
//                                     id: '1f5525c4-9bc9-4c61-9293-1f9b35dff76a',
//                                     type: 'noop',
//                                     items: [],
//                                 },
//                                 actions: [],
//                             },
//                         },
//                     },
//                     __typ: 'field',
//                     key: 'e295cf27-925a-47ef-821d-e1afd21207b9',
//                     descriptorKey: 'field',
//                     settingsValues: {
//                         mask: '',
//                         fieldType: 'select',
//                         label: 'Периодичность уплаты',
//                         name: 'period',
//                         required: true,
//                         visible: false,
//                         disabled: false,
//                         placeholder: '',
//                         inputType: 'text',
//                         checked: false,
//                         options: [
//                             {
//                                 label: 'Ежегодно',
//                                 value: '12',
//                             },
//                         ],
//                         multiple: true,
//                         accept: 'jpg,jpeg,heic,png,pdf',
//                         maxFileSizeMb: '20',
//                     },
//                     layout: {
//                         i: 'e295cf27-925a-47ef-821d-e1afd21207b9',
//                         x: 0,
//                         y: 12,
//                         w: 2,
//                         h: 3,
//                         minW: 1,
//                         moved: false,
//                         static: false,
//                         resizeHandles: ['n', 's', 'w', 'e'],
//                     },
//                 },
//                 'a5d9549b-489c-4e09-9cf8-e560283a98af': {
//                     capabilities: {
//                         canBeVisible: false,
//                         canBeEnabled: false,
//                         canBeRequired: false,
//                         canBeSetValue: false,
//                     },
//                     control: 'input',
//                     fieldType: 'input',
//                     valueType: 'unknown',
//                     logic: {
//                         visibility: {
//                             defaultValue: true,
//                             rule: {
//                                 condition: {
//                                     id: '544cef93-36f4-48ec-929f-a63c6a208235',
//                                     type: 'noop',
//                                     items: [],
//                                 },
//                                 actions: [],
//                             },
//                         },
//                         enabled: {
//                             defaultValue: true,
//                             rule: {
//                                 condition: {
//                                     id: 'c035bd6f-4c38-4f50-93d6-e5cf42a24ab4',
//                                     type: 'noop',
//                                     items: [],
//                                 },
//                                 actions: [],
//                             },
//                         },
//                         required: {
//                             defaultValue: true,
//                             rule: {
//                                 condition: {
//                                     id: '4437eb73-e28d-4dd3-abad-26465b965f30',
//                                     type: 'noop',
//                                     items: [],
//                                 },
//                                 actions: [],
//                             },
//                         },
//                     },
//                     __typ: 'field',
//                     key: 'a5d9549b-489c-4e09-9cf8-e560283a98af',
//                     descriptorKey: 'description',
//                     settingsValues: {
//                         text: 'Застрахованный',
//                         fieldType: 'description',
//                     },
//                     layout: {
//                         i: 'a5d9549b-489c-4e09-9cf8-e560283a98af',
//                         x: 0,
//                         y: 15,
//                         w: 2,
//                         h: 2,
//                         minW: 1,
//                         moved: false,
//                         static: false,
//                         resizeHandles: ['n', 's', 'w', 'e'],
//                     },
//                 },
//                 '139d147d-19d9-4e39-af43-4e150469d388': {
//                     capabilities: {
//                         canBeVisible: false,
//                         canBeEnabled: false,
//                         canBeRequired: false,
//                         canBeSetValue: false,
//                     },
//                     control: 'input',
//                     fieldType: 'input',
//                     valueType: 'unknown',
//                     logic: {
//                         visibility: {
//                             defaultValue: true,
//                             rule: {
//                                 condition: {
//                                     id: '417c2932-7a76-44e0-9cfe-da942342a3dd',
//                                     type: 'noop',
//                                     items: [],
//                                 },
//                                 actions: [],
//                             },
//                         },
//                         enabled: {
//                             defaultValue: true,
//                             rule: {
//                                 condition: {
//                                     id: '8a07bf58-c50c-43d6-807d-055cf4cb261b',
//                                     type: 'noop',
//                                     items: [],
//                                 },
//                                 actions: [],
//                             },
//                         },
//                         required: {
//                             defaultValue: true,
//                             rule: {
//                                 condition: {
//                                     id: '9a07fbd3-bd5e-42db-b147-411948d58248',
//                                     type: 'noop',
//                                     items: [],
//                                 },
//                                 actions: [],
//                             },
//                         },
//                     },
//                     __typ: 'field',
//                     key: '139d147d-19d9-4e39-af43-4e150469d388',
//                     descriptorKey: 'field',
//                     settingsValues: {
//                         mask: '',
//                         fieldType: 'date',
//                         label: 'Дата рождения',
//                         name: 'birthdate',
//                         required: true,
//                         visible: false,
//                         disabled: true,
//                         placeholder: '',
//                         inputType: 'text',
//                         checked: false,
//                         options: [
//                             {
//                                 label: 'Вариант 1',
//                                 value: 'var1',
//                             },
//                             {
//                                 label: 'Вариант 2',
//                                 value: 'var2',
//                             },
//                         ],
//                         multiple: true,
//                         accept: 'jpg,jpeg,heic,png,pdf',
//                         maxFileSizeMb: '20',
//                     },
//                     layout: {
//                         i: '139d147d-19d9-4e39-af43-4e150469d388',
//                         x: 0,
//                         y: 18,
//                         w: 1,
//                         h: 3,
//                         minW: 1,
//                         moved: false,
//                         static: false,
//                         resizeHandles: ['n', 's', 'w', 'e'],
//                     },
//                 },
//                 '6a224b46-b6bd-431d-8b2e-ddb533c1e7f9': {
//                     capabilities: {
//                         canBeVisible: false,
//                         canBeEnabled: false,
//                         canBeRequired: false,
//                         canBeSetValue: false,
//                     },
//                     control: 'input',
//                     fieldType: 'input',
//                     valueType: 'unknown',
//                     logic: {
//                         visibility: {
//                             defaultValue: true,
//                             rule: {
//                                 condition: {
//                                     id: '15886bcb-99ba-4347-87bd-956f0ae658ca',
//                                     type: 'noop',
//                                     items: [],
//                                 },
//                                 actions: [],
//                             },
//                         },
//                         enabled: {
//                             defaultValue: true,
//                             rule: {
//                                 condition: {
//                                     id: 'e4137d3d-7d77-437c-9a1f-e8f0bae7729a',
//                                     type: 'noop',
//                                     items: [],
//                                 },
//                                 actions: [],
//                             },
//                         },
//                         required: {
//                             defaultValue: true,
//                             rule: {
//                                 condition: {
//                                     id: 'c2356999-9403-41c6-8339-eb82f241e836',
//                                     type: 'noop',
//                                     items: [],
//                                 },
//                                 actions: [],
//                             },
//                         },
//                     },
//                     __typ: 'field',
//                     key: '6a224b46-b6bd-431d-8b2e-ddb533c1e7f9',
//                     descriptorKey: 'radio',
//                     settingsValues: {
//                         label: 'Пол',
//                         fieldType: 'radio',
//                         name: 'gender',
//                         required: true,
//                         visible: false,
//                         disabled: false,
//                         theme: 'param',
//                         options: [
//                             {
//                                 label: 'Мужчина',
//                                 value: 'male',
//                             },
//                             {
//                                 label: 'Женщина',
//                                 value: 'female',
//                             },
//                         ],
//                     },
//                     layout: {
//                         i: '6a224b46-b6bd-431d-8b2e-ddb533c1e7f9',
//                         x: 1,
//                         y: 18,
//                         w: 1,
//                         h: 3,
//                         minW: 1,
//                         moved: false,
//                         static: false,
//                         resizeHandles: ['n', 's', 'w', 'e'],
//                     },
//                 },
//             },
//             transition: {
//                 rules: [
//                     {
//                         id: 'b2dffce2-49cb-42ee-aadd-ad9dcbca0b8d',
//                         title: 'Simple step',
//                         when: {
//                             type: 'and',
//                             items: [
//                                 {
//                                     id: 'af04f89b-2e54-408f-9983-ce66352eee14',
//                                     type: 'notEmpty',
//                                     item: {
//                                         __typ: 'ref',
//                                         path: ['constants', 'name'],
//                                         refType: 'const',
//                                     },
//                                 },
//                             ],
//                             id: 'c1ea5c8f-152d-444c-92cc-b7c425e8b48d',
//                         },
//                         targetStep: '14f633cf-d4b4-43bf-9519-9d412ab32613',
//                     },
//                 ],
//             },
//         },
//         '14f633cf-d4b4-43bf-9519-9d412ab32613': {
//             key: '14f633cf-d4b4-43bf-9519-9d412ab32613',
//             title: 'Second step',
//             fields: {
//                 '234e1f5f-d996-4db1-8dd7-f331d828549e': {
//                     capabilities: {
//                         canBeVisible: false,
//                         canBeEnabled: false,
//                         canBeRequired: false,
//                         canBeSetValue: false,
//                     },
//                     control: 'input',
//                     fieldType: 'input',
//                     valueType: 'unknown',
//                     logic: {
//                         visibility: {
//                             defaultValue: true,
//                             rule: {
//                                 condition: {
//                                     id: '610206b7-4603-4d9d-bd3a-bdaaeb0db32d',
//                                     type: 'noop',
//                                     items: [],
//                                 },
//                                 actions: [],
//                             },
//                         },
//                         enabled: {
//                             defaultValue: true,
//                             rule: {
//                                 condition: {
//                                     id: '92497435-a811-426d-9b15-86866075957a',
//                                     type: 'noop',
//                                     items: [],
//                                 },
//                                 actions: [],
//                             },
//                         },
//                         required: {
//                             defaultValue: true,
//                             rule: {
//                                 condition: {
//                                     id: '348ad9b9-271c-4021-8a25-281042c3215b',
//                                     type: 'noop',
//                                     items: [],
//                                 },
//                                 actions: [],
//                             },
//                         },
//                     },
//                     __typ: 'field',
//                     key: '234e1f5f-d996-4db1-8dd7-f331d828549e',
//                     descriptorKey: 'agree',
//                     settingsValues: {
//                         text: 'Соглашение',
//                         description:
//                             'Настоящее Пользовательское соглашение (далее — «Соглашение») регулирует порядок использования информационного сервиса, программного обеспечения и связанных с ним функциональных возможностей (далее — «Сервис»). Используя Сервис, пользователь подтверждает, что ознакомился с условиями настоящего Соглашения, понимает их и принимает в полном объёме без каких-либо оговорок и исключений. 1. Общие положения 1.1. Сервис предоставляет пользователю доступ к функционалу, предназначенному для обработки, хранения и отображения информации. 1.2. Использование Сервиса допускается только при условии соблюдения всех требований, изложенных в настоящем Соглашении. 1.3. Администрация Сервиса оставляет за собой право изменять или обновлять условия Соглашения без предварительного уведомления пользователя. 2. Права и обязанности пользователя Пользователь обязуется: предоставлять достоверную информацию при использовании Сервиса; не предпринимать действий, направленных на нарушение работы Сервиса; не использовать Сервис в противоправных целях; соблюдать применимое законодательство при использовании функционала платформы. Пользователь имеет право: использовать Сервис в рамках предоставленного функционала; получать информацию о работе Сервиса; прекратить использование Сервиса в любой момент. 3. Ограничение ответственности 3.1. Сервис предоставляется «как есть» без каких-либо гарантий бесперебойной или безошибочной работы. 3.2. Администрация не несёт ответственности за возможные убытки, возникшие в результате использования или невозможности использования Сервиса. 3.3. Пользователь самостоятельно несёт ответственность за действия, совершённые с использованием его учётной записи.',
//                         fieldType: 'agree',
//                     },
//                     layout: {
//                         i: '234e1f5f-d996-4db1-8dd7-f331d828549e',
//                         x: 2,
//                         y: 0,
//                         w: 3,
//                         h: 11,
//                         minW: 1,
//                         moved: false,
//                         static: false,
//                         resizeHandles: ['n', 's', 'w', 'e'],
//                     },
//                 },
//             },
//             transition: {
//                 rules: [],
//             },
//         },
//     },
//     lookups: {},
//     constants: {
//         name: {
//             __typ: 'constant',
//             key: 'name',
//             label: 'Form name',
//             valueType: 'string',
//             value: 'simple name',
//         },
//         enabled: {
//             __typ: 'constant',
//             key: 'enabled',
//             label: 'Form enabled',
//             valueType: 'boolean',
//             value: true,
//         },
//     },
//     variables: {},
//     interactions: {
//         some: {
//             key: 'some',
//             title: 'some',
//             dependentFields: [
//                 ['constants', 'name'],
//                 ['steps', 'start', 'fields', 'dddcaaaa-2c84-4812-a5ce-233b0f05f1ce'],
//             ],
//             execute: async (abort, fields) => {
//                 return (state) => ({
//                     fieldsValues: {
//                         foo: 'bar',
//                     },
//                 });
//             },
//         },
//     },
// };
import type {FormDefinition} from "../logic/type.ts";

export const TEST: FormDefinition = {
    "firstStepKey": "start",
    "steps": {
        "start": {
            "key": "start",
            "title": "First step",
            "fields": {
                "15c5848e-3d4f-4c34-be8b-3436578234fc": {
                    "capabilities": {
                        "canBeVisible": false,
                        "canBeEnabled": false,
                        "canBeRequired": false,
                        "canBeSetValue": false
                    },
                    "control": "input",
                    "fieldType": "input",
                    "valueType": "unknown",
                    "logic": {
                        "visibility": {
                            "defaultValue": true,
                            "rule": {
                                "condition": {
                                    "id": "49f15f84-bd2b-4219-8168-186ee8d9fa60",
                                    "type": "noop",
                                    "items": []
                                },
                                "actions": []
                            }
                        },
                        "enabled": {
                            "defaultValue": true,
                            "rule": {
                                "condition": {
                                    "id": "6a3bd1f5-72ae-4e40-866c-bbd03f97a1d1",
                                    "type": "noop",
                                    "items": []
                                },
                                "actions": []
                            }
                        },
                        "required": {
                            "defaultValue": true,
                            "rule": {
                                "condition": {
                                    "id": "7691cfb7-0605-4675-950f-ccff32265f3e",
                                    "type": "noop",
                                    "items": []
                                },
                                "actions": []
                            }
                        }
                    },
                    "__typ": "field",
                    "key": "15c5848e-3d4f-4c34-be8b-3436578234fc",
                    "descriptorKey": "radio",
                    "settingsValues": {
                        "label": "Тип рассчеиа",
                        "fieldType": "radio",
                        "name": "calcType",
                        "required": false,
                        "visible": false,
                        "disabled": false,
                        "theme": "param",
                        "options": [
                            {
                                "label": "По СС",
                                "value": "sum"
                            },
                            {
                                "label": "По премии",
                                "value": "premium"
                            }
                        ]
                    },
                    "layout": {
                        "i": "15c5848e-3d4f-4c34-be8b-3436578234fc",
                        "x": 0,
                        "y": 0,
                        "w": 2,
                        "h": 3,
                        "minW": 1,
                        "moved": false,
                        "static": false,
                        "resizeHandles": [
                            "n",
                            "s",
                            "w",
                            "e"
                        ]
                    }
                },
                "a671a831-1094-483c-b20f-8d7fbf86d80b": {
                    "capabilities": {
                        "canBeVisible": false,
                        "canBeEnabled": false,
                        "canBeRequired": false,
                        "canBeSetValue": false
                    },
                    "control": "input",
                    "fieldType": "input",
                    "valueType": "unknown",
                    "logic": {
                        "visibility": {
                            "defaultValue": true,
                            "rule": {
                                "condition": {
                                    "id": "3bbfbced-59f9-4018-b464-29a74b384a85",
                                    "type": "noop",
                                    "items": []
                                },
                                "actions": []
                            }
                        },
                        "enabled": {
                            "defaultValue": true,
                            "rule": {
                                "condition": {
                                    "id": "6146319a-6076-49c3-a0b5-597a91ecf01b",
                                    "type": "noop",
                                    "items": []
                                },
                                "actions": []
                            }
                        },
                        "required": {
                            "defaultValue": true,
                            "rule": {
                                "condition": {
                                    "id": "64a703a7-9867-417e-a432-dc1a4a996bd6",
                                    "type": "noop",
                                    "items": []
                                },
                                "actions": []
                            }
                        }
                    },
                    "__typ": "field",
                    "key": "a671a831-1094-483c-b20f-8d7fbf86d80b",
                    "descriptorKey": "radio",
                    "settingsValues": {
                        "label": "Тип выплаты",
                        "fieldType": "radio",
                        "name": "paymentType",
                        "required": false,
                        "visible": false,
                        "disabled": false,
                        "theme": "param",
                        "options": [
                            {
                                "label": "Отложенная",
                                "value": "delayed"
                            },
                            {
                                "label": "Немедленная",
                                "value": "instant"
                            }
                        ]
                    },
                    "layout": {
                        "i": "a671a831-1094-483c-b20f-8d7fbf86d80b",
                        "x": 0,
                        "y": 3,
                        "w": 2,
                        "h": 3,
                        "minW": 1,
                        "moved": false,
                        "static": false,
                        "resizeHandles": [
                            "n",
                            "s",
                            "w",
                            "e"
                        ]
                    }
                },
                "f1cf2101-9ef1-4dff-bfe8-8687884755e5": {
                    "capabilities": {
                        "canBeVisible": false,
                        "canBeEnabled": false,
                        "canBeRequired": false,
                        "canBeSetValue": false
                    },
                    "control": "input",
                    "fieldType": "input",
                    "valueType": "unknown",
                    "logic": {
                        "visibility": {
                            "defaultValue": true,
                            "rule": {
                                "condition": {
                                    "id": "daa483d5-0223-44a9-9ddb-dd797fb55513",
                                    "type": "noop",
                                    "items": []
                                },
                                "actions": []
                            }
                        },
                        "enabled": {
                            "defaultValue": true,
                            "rule": {
                                "condition": {
                                    "id": "28cc0744-22e9-4ff3-be9a-058d00f0b534",
                                    "type": "noop",
                                    "items": []
                                },
                                "actions": []
                            }
                        },
                        "required": {
                            "defaultValue": true,
                            "rule": {
                                "condition": {
                                    "id": "96e517a9-2903-419f-892a-33928397e3f4",
                                    "type": "noop",
                                    "items": []
                                },
                                "actions": []
                            }
                        },
                        "validation": {
                            "condition": {
                                "id": "fdbf837e-1d57-4186-9bbe-e65af88b3e58",
                                "type": "and",
                                "items": [
                                    {
                                        "id": "2fa3c3ef-be2b-492e-a171-006dcb7774c8",
                                        "type": "or",
                                        "items": [
                                            {
                                                "id": "0f7347be-967d-4f48-a2a7-ae9a064600d2",
                                                "type": "eq",
                                                "left": {
                                                    "__typ": "ref",
                                                    "path": [
                                                        "start",
                                                        "fields",
                                                        "dddcaaaa-2c84-4812-a5ce-233b0f05f1ce"
                                                    ],
                                                    "refType": "field"
                                                },
                                                "right": {
                                                    "__typ": "const",
                                                    "value": 1,
                                                    "valueType": "number"
                                                }
                                            },
                                            {
                                                "id": "9aaa5b3f-de0e-45da-bab4-3a41af6732f7",
                                                "type": "lt",
                                                "left": {
                                                    "__typ": "ref",
                                                    "path": [
                                                        "start",
                                                        "fields",
                                                        "f1cf2101-9ef1-4dff-bfe8-8687884755e5"
                                                    ],
                                                    "refType": "field"
                                                },
                                                "right": {
                                                    "__typ": "const",
                                                    "value": 5,
                                                    "valueType": "number"
                                                }
                                            },
                                            {
                                                "id": "5bef41a3-b727-4397-8339-56ae5f3149ad",
                                                "type": "gt",
                                                "left": {
                                                    "__typ": "ref",
                                                    "path": [
                                                        "start",
                                                        "fields",
                                                        "f1cf2101-9ef1-4dff-bfe8-8687884755e5"
                                                    ],
                                                    "refType": "field"
                                                },
                                                "right": {
                                                    "__typ": "const",
                                                    "value": 40,
                                                    "valueType": "number"
                                                }
                                            }
                                        ]
                                    },
                                    {
                                        "id": "335e7f85-f343-486f-9dc4-2552749186df",
                                        "type": "notEmpty",
                                        "item": {
                                            "__typ": "ref",
                                            "path": [
                                                "start",
                                                "fields",
                                                "f1cf2101-9ef1-4dff-bfe8-8687884755e5"
                                            ],
                                            "refType": "field"
                                        },
                                        "left": {
                                            "__typ": "ref",
                                            "path": [
                                                "start",
                                                "fields",
                                                "f1cf2101-9ef1-4dff-bfe8-8687884755e5"
                                            ],
                                            "refType": "field"
                                        }
                                    }
                                ]
                            },
                            "actions": [
                                {
                                    "type": "setFieldError",
                                    "text": "Диапазон 5 40s"
                                }
                            ]
                        }
                    },
                    "__typ": "field",
                    "key": "f1cf2101-9ef1-4dff-bfe8-8687884755e5",
                    "descriptorKey": "field",
                    "settingsValues": {
                        "mask": "",
                        "fieldType": "input",
                        "label": "Срок действия, лет",
                        "name": "years",
                        "required": true,
                        "visible": false,
                        "disabled": false,
                        "placeholder": "",
                        "inputType": "text",
                        "checked": false,
                        "options": [
                            {
                                "label": "Вариант 1",
                                "value": "var1"
                            },
                            {
                                "label": "Вариант 2",
                                "value": "var2"
                            }
                        ],
                        "multiple": true,
                        "accept": "jpg,jpeg,heic,png,pdf",
                        "maxFileSizeMb": "20"
                    },
                    "layout": {
                        "i": "f1cf2101-9ef1-4dff-bfe8-8687884755e5",
                        "x": 0,
                        "y": 6,
                        "w": 1,
                        "h": 3,
                        "minW": 1,
                        "moved": false,
                        "static": false,
                        "resizeHandles": [
                            "n",
                            "s",
                            "w",
                            "e"
                        ]
                    }
                },
                "dddcaaaa-2c84-4812-a5ce-233b0f05f1ce": {
                    "capabilities": {
                        "canBeVisible": false,
                        "canBeEnabled": false,
                        "canBeRequired": false,
                        "canBeSetValue": false
                    },
                    "control": "input",
                    "fieldType": "input",
                    "valueType": "unknown",
                    "logic": {
                        "visibility": {
                            "defaultValue": true,
                            "rule": {
                                "condition": {
                                    "id": "ab9c3342-7a31-43e2-9453-5e5ca2e3fc78",
                                    "type": "noop",
                                    "items": []
                                },
                                "actions": []
                            }
                        },
                        "enabled": {
                            "defaultValue": true,
                            "rule": {
                                "condition": {
                                    "id": "586c772d-a251-4377-bfbf-834a7bd6dd90",
                                    "type": "noop",
                                    "items": []
                                },
                                "actions": []
                            }
                        },
                        "required": {
                            "defaultValue": true,
                            "rule": {
                                "condition": {
                                    "id": "61756689-c1c5-45ce-80ab-e96af4158614",
                                    "type": "noop",
                                    "items": []
                                },
                                "actions": []
                            }
                        }
                    },
                    "__typ": "field",
                    "key": "dddcaaaa-2c84-4812-a5ce-233b0f05f1ce",
                    "descriptorKey": "field",
                    "settingsValues": {
                        "mask": "",
                        "fieldType": "input",
                        "label": "Срок уплаты взносов",
                        "name": "paymentPeriod",
                        "required": true,
                        "visible": false,
                        "disabled": false,
                        "placeholder": "",
                        "inputType": "text",
                        "checked": false,
                        "options": [
                            {
                                "label": "Вариант 1",
                                "value": "var1"
                            },
                            {
                                "label": "Вариант 2",
                                "value": "var2"
                            }
                        ],
                        "multiple": true,
                        "accept": "jpg,jpeg,heic,png,pdf",
                        "maxFileSizeMb": "20"
                    },
                    "layout": {
                        "i": "dddcaaaa-2c84-4812-a5ce-233b0f05f1ce",
                        "x": 1,
                        "y": 6,
                        "w": 1,
                        "h": 3,
                        "minW": 1,
                        "moved": false,
                        "static": false,
                        "resizeHandles": [
                            "n",
                            "s",
                            "w",
                            "e"
                        ]
                    }
                },
                "7abf3482-cb8e-4542-909a-00c0b5597b8e": {
                    "capabilities": {
                        "canBeVisible": false,
                        "canBeEnabled": false,
                        "canBeRequired": false,
                        "canBeSetValue": false
                    },
                    "control": "input",
                    "fieldType": "input",
                    "valueType": "unknown",
                    "logic": {
                        "visibility": {
                            "defaultValue": true,
                            "rule": {
                                "condition": {
                                    "id": "5e8762de-9326-4911-ab6c-6074d14c318a",
                                    "type": "noop",
                                    "items": []
                                },
                                "actions": []
                            }
                        },
                        "enabled": {
                            "defaultValue": true,
                            "rule": {
                                "condition": {
                                    "id": "9b0b78af-1337-4fca-9813-ff3c450dc3aa",
                                    "type": "noop",
                                    "items": []
                                },
                                "actions": []
                            }
                        },
                        "required": {
                            "defaultValue": true,
                            "rule": {
                                "condition": {
                                    "id": "8858000d-61cd-48b0-a642-cc35f6d76310",
                                    "type": "noop",
                                    "items": []
                                },
                                "actions": []
                            }
                        },
                        "validation": {
                            "condition": {
                                "id": "4859376d-9f34-498b-9fbc-125fd4fc481e",
                                "type": "and",
                                "items": [
                                    {
                                        "id": "f0903dda-fb50-48d6-9a2e-c9fc13e76c96",
                                        "type": "lte",
                                        "left": {
                                            "__typ": "ref",
                                            "path": [
                                                "start",
                                                "fields",
                                                "7abf3482-cb8e-4542-909a-00c0b5597b8e"
                                            ],
                                            "refType": "field"
                                        },
                                        "right": {
                                            "__typ": "const",
                                            "value": 100,
                                            "valueType": "number"
                                        }
                                    }
                                ]
                            },
                            "actions": [
                                {
                                    "type": "setFieldError",
                                    "text": "must be greater than 100"
                                }
                            ]
                        }
                    },
                    "__typ": "field",
                    "key": "7abf3482-cb8e-4542-909a-00c0b5597b8e",
                    "descriptorKey": "field",
                    "settingsValues": {
                        "mask": "",
                        "fieldType": "input",
                        "label": "Страховая сумма",
                        "name": "ins_sum",
                        "required": true,
                        "visible": false,
                        "disabled": false,
                        "placeholder": "",
                        "inputType": "text",
                        "checked": false,
                        "options": [
                            {
                                "label": "Вариант 1",
                                "value": "var1"
                            },
                            {
                                "label": "Вариант 2",
                                "value": "var2"
                            }
                        ],
                        "multiple": true,
                        "accept": "jpg,jpeg,heic,png,pdf",
                        "maxFileSizeMb": "20"
                    },
                    "layout": {
                        "i": "7abf3482-cb8e-4542-909a-00c0b5597b8e",
                        "x": 0,
                        "y": 9,
                        "w": 2,
                        "h": 3,
                        "minW": 1,
                        "moved": false,
                        "static": false,
                        "resizeHandles": [
                            "n",
                            "s",
                            "w",
                            "e"
                        ]
                    }
                },
                "e295cf27-925a-47ef-821d-e1afd21207b9": {
                    "capabilities": {
                        "canBeVisible": false,
                        "canBeEnabled": false,
                        "canBeRequired": false,
                        "canBeSetValue": false
                    },
                    "control": "input",
                    "fieldType": "input",
                    "valueType": "unknown",
                    "logic": {
                        "visibility": {
                            "defaultValue": true,
                            "rule": {
                                "condition": {
                                    "id": "f9c9cdf3-9023-4dc0-b1dc-cd032ede5767",
                                    "type": "noop",
                                    "items": []
                                },
                                "actions": []
                            }
                        },
                        "enabled": {
                            "defaultValue": true,
                            "rule": {
                                "condition": {
                                    "id": "90cff997-935a-46ed-b66b-8ba89ac3c8f9",
                                    "type": "noop",
                                    "items": []
                                },
                                "actions": []
                            }
                        },
                        "required": {
                            "defaultValue": true,
                            "rule": {
                                "condition": {
                                    "id": "1f5525c4-9bc9-4c61-9293-1f9b35dff76a",
                                    "type": "noop",
                                    "items": []
                                },
                                "actions": []
                            }
                        }
                    },
                    "__typ": "field",
                    "key": "e295cf27-925a-47ef-821d-e1afd21207b9",
                    "descriptorKey": "field",
                    "settingsValues": {
                        "mask": "",
                        "fieldType": "select",
                        "label": "Периодичность уплаты",
                        "name": "period",
                        "required": true,
                        "visible": false,
                        "disabled": false,
                        "placeholder": "",
                        "inputType": "text",
                        "checked": false,
                        "options": [
                            {
                                "label": "Ежегодно",
                                "value": "12"
                            }
                        ],
                        "multiple": true,
                        "accept": "jpg,jpeg,heic,png,pdf",
                        "maxFileSizeMb": "20"
                    },
                    "layout": {
                        "i": "e295cf27-925a-47ef-821d-e1afd21207b9",
                        "x": 0,
                        "y": 12,
                        "w": 2,
                        "h": 3,
                        "minW": 1,
                        "moved": false,
                        "static": false,
                        "resizeHandles": [
                            "n",
                            "s",
                            "w",
                            "e"
                        ]
                    }
                },
                "a5d9549b-489c-4e09-9cf8-e560283a98af": {
                    "capabilities": {
                        "canBeVisible": false,
                        "canBeEnabled": false,
                        "canBeRequired": false,
                        "canBeSetValue": false
                    },
                    "control": "input",
                    "fieldType": "input",
                    "valueType": "unknown",
                    "logic": {
                        "visibility": {
                            "defaultValue": true,
                            "rule": {
                                "condition": {
                                    "id": "544cef93-36f4-48ec-929f-a63c6a208235",
                                    "type": "noop",
                                    "items": []
                                },
                                "actions": []
                            }
                        },
                        "enabled": {
                            "defaultValue": true,
                            "rule": {
                                "condition": {
                                    "id": "c035bd6f-4c38-4f50-93d6-e5cf42a24ab4",
                                    "type": "noop",
                                    "items": []
                                },
                                "actions": []
                            }
                        },
                        "required": {
                            "defaultValue": true,
                            "rule": {
                                "condition": {
                                    "id": "4437eb73-e28d-4dd3-abad-26465b965f30",
                                    "type": "noop",
                                    "items": []
                                },
                                "actions": []
                            }
                        }
                    },
                    "__typ": "field",
                    "key": "a5d9549b-489c-4e09-9cf8-e560283a98af",
                    "descriptorKey": "description",
                    "settingsValues": {
                        "text": "Застрахованный",
                        "fieldType": "description"
                    },
                    "layout": {
                        "i": "a5d9549b-489c-4e09-9cf8-e560283a98af",
                        "x": 0,
                        "y": 15,
                        "w": 2,
                        "h": 2,
                        "minW": 1,
                        "moved": false,
                        "static": false,
                        "resizeHandles": [
                            "n",
                            "s",
                            "w",
                            "e"
                        ]
                    }
                },
                "139d147d-19d9-4e39-af43-4e150469d388": {
                    "capabilities": {
                        "canBeVisible": false,
                        "canBeEnabled": false,
                        "canBeRequired": false,
                        "canBeSetValue": false
                    },
                    "control": "input",
                    "fieldType": "input",
                    "valueType": "unknown",
                    "logic": {
                        "visibility": {
                            "defaultValue": true,
                            "rule": {
                                "condition": {
                                    "id": "417c2932-7a76-44e0-9cfe-da942342a3dd",
                                    "type": "noop",
                                    "items": []
                                },
                                "actions": []
                            }
                        },
                        "enabled": {
                            "defaultValue": true,
                            "rule": {
                                "condition": {
                                    "id": "8a07bf58-c50c-43d6-807d-055cf4cb261b",
                                    "type": "noop",
                                    "items": []
                                },
                                "actions": []
                            }
                        },
                        "required": {
                            "defaultValue": true,
                            "rule": {
                                "condition": {
                                    "id": "9a07fbd3-bd5e-42db-b147-411948d58248",
                                    "type": "noop",
                                    "items": []
                                },
                                "actions": []
                            }
                        }
                    },
                    "__typ": "field",
                    "key": "139d147d-19d9-4e39-af43-4e150469d388",
                    "descriptorKey": "field",
                    "settingsValues": {
                        "mask": "",
                        "fieldType": "date",
                        "label": "Дата рождения",
                        "name": "birthdate",
                        "required": true,
                        "visible": false,
                        "disabled": true,
                        "placeholder": "",
                        "inputType": "text",
                        "checked": false,
                        "options": [
                            {
                                "label": "Вариант 1",
                                "value": "var1"
                            },
                            {
                                "label": "Вариант 2",
                                "value": "var2"
                            }
                        ],
                        "multiple": true,
                        "accept": "jpg,jpeg,heic,png,pdf",
                        "maxFileSizeMb": "20"
                    },
                    "layout": {
                        "i": "139d147d-19d9-4e39-af43-4e150469d388",
                        "x": 0,
                        "y": 17,
                        "w": 1,
                        "h": 3,
                        "minW": 1,
                        "moved": false,
                        "static": false,
                        "resizeHandles": [
                            "n",
                            "s",
                            "w",
                            "e"
                        ]
                    }
                },
                "6a224b46-b6bd-431d-8b2e-ddb533c1e7f9": {
                    "capabilities": {
                        "canBeVisible": false,
                        "canBeEnabled": false,
                        "canBeRequired": false,
                        "canBeSetValue": false
                    },
                    "control": "input",
                    "fieldType": "input",
                    "valueType": "unknown",
                    "logic": {
                        "visibility": {
                            "defaultValue": true,
                            "rule": {
                                "condition": {
                                    "id": "15886bcb-99ba-4347-87bd-956f0ae658ca",
                                    "type": "noop",
                                    "items": []
                                },
                                "actions": []
                            }
                        },
                        "enabled": {
                            "defaultValue": true,
                            "rule": {
                                "condition": {
                                    "id": "e4137d3d-7d77-437c-9a1f-e8f0bae7729a",
                                    "type": "noop",
                                    "items": []
                                },
                                "actions": []
                            }
                        },
                        "required": {
                            "defaultValue": true,
                            "rule": {
                                "condition": {
                                    "id": "c2356999-9403-41c6-8339-eb82f241e836",
                                    "type": "noop",
                                    "items": []
                                },
                                "actions": []
                            }
                        }
                    },
                    "__typ": "field",
                    "key": "6a224b46-b6bd-431d-8b2e-ddb533c1e7f9",
                    "descriptorKey": "radio",
                    "settingsValues": {
                        "label": "Пол",
                        "fieldType": "radio",
                        "name": "gender",
                        "required": true,
                        "visible": false,
                        "disabled": false,
                        "theme": "param",
                        "options": [
                            {
                                "label": "Мужчина",
                                "value": "male"
                            },
                            {
                                "label": "Женщина",
                                "value": "female"
                            }
                        ]
                    },
                    "layout": {
                        "i": "6a224b46-b6bd-431d-8b2e-ddb533c1e7f9",
                        "x": 1,
                        "y": 17,
                        "w": 1,
                        "h": 3,
                        "minW": 1,
                        "moved": false,
                        "static": false,
                        "resizeHandles": [
                            "n",
                            "s",
                            "w",
                            "e"
                        ]
                    }
                }
            },
            "transition": {
                "rules": [
                    {
                        "id": "b2dffce2-49cb-42ee-aadd-ad9dcbca0b8d",
                        "title": "Simple step",
                        "when": {
                            "type": "and",
                            "items": [
                                {
                                    "id": "af04f89b-2e54-408f-9983-ce66352eee14",
                                    "type": "notEmpty",
                                    "item": {
                                        "__typ": "ref",
                                        "path": [
                                            "constants",
                                            "name"
                                        ],
                                        "refType": "const"
                                    }
                                }
                            ],
                            "id": "c1ea5c8f-152d-444c-92cc-b7c425e8b48d"
                        },
                        "targetStep": "14f633cf-d4b4-43bf-9519-9d412ab32613"
                    }
                ]
            }
        },
        "14f633cf-d4b4-43bf-9519-9d412ab32613": {
            "key": "14f633cf-d4b4-43bf-9519-9d412ab32613",
            "title": "Second step",
            "fields": {
                "234e1f5f-d996-4db1-8dd7-f331d828549e": {
                    "capabilities": {
                        "canBeVisible": false,
                        "canBeEnabled": false,
                        "canBeRequired": false,
                        "canBeSetValue": false
                    },
                    "control": "input",
                    "fieldType": "input",
                    "valueType": "unknown",
                    "logic": {
                        "visibility": {
                            "defaultValue": true,
                            "rule": {
                                "condition": {
                                    "id": "610206b7-4603-4d9d-bd3a-bdaaeb0db32d",
                                    "type": "noop",
                                    "items": []
                                },
                                "actions": []
                            }
                        },
                        "enabled": {
                            "defaultValue": true,
                            "rule": {
                                "condition": {
                                    "id": "92497435-a811-426d-9b15-86866075957a",
                                    "type": "noop",
                                    "items": []
                                },
                                "actions": []
                            }
                        },
                        "required": {
                            "defaultValue": true,
                            "rule": {
                                "condition": {
                                    "id": "348ad9b9-271c-4021-8a25-281042c3215b",
                                    "type": "noop",
                                    "items": []
                                },
                                "actions": []
                            }
                        }
                    },
                    "__typ": "field",
                    "key": "234e1f5f-d996-4db1-8dd7-f331d828549e",
                    "descriptorKey": "agree",
                    "settingsValues": {
                        "text": "Соглашение",
                        "description": "Настоящее Пользовательское соглашение (далее — «Соглашение») регулирует порядок использования информационного сервиса, программного обеспечения и связанных с ним функциональных возможностей (далее — «Сервис»). Используя Сервис, пользователь подтверждает, что ознакомился с условиями настоящего Соглашения, понимает их и принимает в полном объёме без каких-либо оговорок и исключений. 1. Общие положения 1.1. Сервис предоставляет пользователю доступ к функционалу, предназначенному для обработки, хранения и отображения информации. 1.2. Использование Сервиса допускается только при условии соблюдения всех требований, изложенных в настоящем Соглашении. 1.3. Администрация Сервиса оставляет за собой право изменять или обновлять условия Соглашения без предварительного уведомления пользователя. 2. Права и обязанности пользователя Пользователь обязуется: предоставлять достоверную информацию при использовании Сервиса; не предпринимать действий, направленных на нарушение работы Сервиса; не использовать Сервис в противоправных целях; соблюдать применимое законодательство при использовании функционала платформы. Пользователь имеет право: использовать Сервис в рамках предоставленного функционала; получать информацию о работе Сервиса; прекратить использование Сервиса в любой момент. 3. Ограничение ответственности 3.1. Сервис предоставляется «как есть» без каких-либо гарантий бесперебойной или безошибочной работы. 3.2. Администрация не несёт ответственности за возможные убытки, возникшие в результате использования или невозможности использования Сервиса. 3.3. Пользователь самостоятельно несёт ответственность за действия, совершённые с использованием его учётной записи.",
                        "fieldType": "agree"
                    },
                    "layout": {
                        "i": "234e1f5f-d996-4db1-8dd7-f331d828549e",
                        "x": 2,
                        "y": 0,
                        "w": 3,
                        "h": 11,
                        "minW": 1,
                        "moved": false,
                        "static": false,
                        "resizeHandles": [
                            "n",
                            "s",
                            "w",
                            "e"
                        ]
                    }
                }
            },
            "transition": {
                "rules": []
            }
        }
    },
    "constants": {
        "name": {
            "__typ": "constant",
            "key": "name",
            "label": "Form name",
            "valueType": "string",
            "value": "simple name"
        },
        "enabled": {
            "__typ": "constant",
            "key": "enabled",
            "label": "Form enabled",
            "valueType": "boolean",
            "value": true
        }
    },
    "variables": {},
    "interactions": {
        "some": {
            "key": "some",
            "title": "some",
            "dependentFields": [
                [
                    "constants",
                    "name"
                ],
                [
                    "steps",
                    "start",
                    "fields",
                    "dddcaaaa-2c84-4812-a5ce-233b0f05f1ce"
                ]
            ],
            execute: async (abort, fields) => {
                return (state) => ({
                    fieldsValues: {
                        ...state.fieldsValues,
                        foo: 'bar',
                    },
                });
            },
        }
    },
    lookups: {},
}