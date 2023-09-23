export interface SectionItem {
    id: string;
    title: string;
    date: Date;
    count: number;
    sprintName: string;
    group: string;
    prioririy: 'high' | 'medium' | 'low'
}