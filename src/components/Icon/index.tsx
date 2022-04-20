import { AiOutlineDownload, AiOutlineUpload } from 'react-icons/ai';
import { IoIosRadio } from 'react-icons/io';
import { GiElectric } from 'react-icons/gi';

const getColor = (type: string) => {
    const colors = new Map();
    colors.set('download', '#264653');
    colors.set('upload', '#2A9D8F');
    colors.set('jitter', '#F4A261');
    colors.set('ping', '#E76F51');
    return colors.get(type);
}

const getIcon = (type: string) => {
    const colors = new Map();
    colors.set('download', <AiOutlineDownload size="18px" color={getColor(type)} />);
    colors.set('upload', <AiOutlineUpload size="18px" color={getColor(type)} />);
    colors.set('jitter', <IoIosRadio size="18px" color={getColor(type)} />);
    colors.set('ping', <GiElectric size="18px" color={getColor(type)} />);
    return colors.get(type) || colors.get('download');
}

export const Icon = (props: { type: string }) => {
    return <>{getIcon(props.type)}</>
}