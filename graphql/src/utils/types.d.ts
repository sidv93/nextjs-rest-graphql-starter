type Type = '$match' | '$sort' | '$limit' | '$skip' | '$project';

export type Pipeline = {
    [key in Type]?: any;
}
