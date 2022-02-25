export function getStyles(name, personName, theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium,
    };
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
export const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

export const names = [
    "Oliver Hansen",
    "Van Henry",
    "April Tucker",
    "Ralph Hubbard",
    "Omar Alexander",
    "Carlos Abbott",
    "Miriam Wagner",
    "Bradley Wilkerson",
    "Virginia Andrews",
    "Kelly Snyder",
];

export const ucs = [
    {
        acronym: "COMP",
        name: "Compiladores",
        weekday: "Sexta",
        time: "11:30 - 12:30",
        room: "B112",
        teacher: "TDRC",
        class: "3MIEIC01",
    },
    {
        acronym: "SDIS",
        name: "Sistemas Distribuídos",
        weekday: "Segunda",
        time: "14:30 - 16:30",
        room: "B301",
        teacher: "RGR",
        class: "3MIEIC04",
    },
    {
        acronym: "LBAW",
        name: "Laboratório de Bases de Dados e Aplicações Web",
        weekday: "Segunda",
        time: "09:00 - 12:00",
        room: "B314",
        teacher: "JCL",
        class: "3MIEIC01",
    },
    {
        acronym: "PPIN",
        name: "Proficiência Pessoal e Interpessoal",
        weekday: "Quinta",
        time: "10:30 - 12:30",
        room: "B107",
        teacher: "MFT",
        class: "3MIEIC05",
    },
    {
        acronym: "IART",
        name: "Inteligência Artificial",
        weekday: "Terça",
        time: "11:30 - 12:30",
        room: "B105",
        teacher: "HLC",
        class: "3MIEIC02",
    },
];
