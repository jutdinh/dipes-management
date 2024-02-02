import Text from './text'
import Table from './table';
import Flex from './flex';
import Entry from './entry';
import Form from './form';
import Button from './button'
import Block from './block'
import Datetime from './datetime';
import ApiCombo from './apiCombobox';
import Chart_1 from './chart_1';
import Chart_2 from './chart_2';
import TableParam from './table_param'
import ReDirectButton from './redirect_button';
import TableExportButton from './table_export_button';
import CChart from './c_chart';
import InlineStatis from './inline_statis';

import CustomButton from './custom_button';

const exporter = {
    "text": Text,
    "table": Table,
    "flex": Flex,
    "entry": Entry,
    "block": Block,
    "form": Form,
    "button": Button,
    "datetime": Datetime,
    "apiCombo": ApiCombo,
    "chart_1": Chart_1,
    "chart_2": Chart_2,
    "table_param": TableParam,
    "redirect_button": ReDirectButton,
    "table_export_button": TableExportButton,
    "c_chart": CChart,
    "custom_button": CustomButton,
    "inline_statis": InlineStatis
}

export default exporter