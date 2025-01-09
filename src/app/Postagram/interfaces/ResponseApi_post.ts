export interface GetAllPost {
    message: string;
    post:    Post[];
}

export interface Post {
    title:           string;
    publicationDate: Date;
    urlImage:        string;
}
export interface CreatePosResponse {
    message: string;
    post:    Post;
}
export interface CreatedPost {
    title:           string;
    publicationDate: Date;
    image:           Image;
    userId:          number;
}

export interface Image {
    contentType:        string;
    contentDisposition: string;
    headers:            Headers;
    length:             number;
    name:               string;
    fileName:           string;
}

