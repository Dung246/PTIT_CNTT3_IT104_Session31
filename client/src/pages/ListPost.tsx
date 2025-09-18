import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';

interface Post {
    id?: number;
    title: string;
    image: string;
    date: string;
    status: boolean;
    content: string;
}

export default function ListPost() {
    const [show, setShow] = useState(false);
    const [posts, setPosts] = useState<Post[]>([]);
    const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);

    const defaultPost: Post = {
        title: "",
        image: "",
        date: new Date().toLocaleDateString(),
        status: false,
        content: ""
    };

    const [post, setPost] = useState<Post>({ ...defaultPost });

    const handleClose = () => {
        setShow(false);
        setPost({ ...defaultPost });
        setEditingId(null);
    };
    const handleShow = () => setShow(true);

    const getAllPosts = async () => {
        const response = await axios.get('http://localhost:8000/posts');
        setPosts(response.data);
        setFilteredPosts(response.data);
    };

    useEffect(() => {
        getAllPosts();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const target = e.target as HTMLInputElement;
        const { name, value, type, checked } = target;
        const newValue = type === 'checkbox' ? checked : value;
        setPost({ ...post, [name]: newValue });
    };

    const handleSave = async () => {
        try {
            if (editingId !== null) {
                await axios.put(`http://localhost:8000/posts/${editingId}`, post);
            } else {
                await axios.post('http://localhost:8000/posts', post);
            }
            handleClose();
            getAllPosts();
        } catch (error) {
            alert('Thêm/Cập nhật bài viết thất bại!');
        }
    };

    const handleEdit = (post: Post) => {
        setPost(post);
        setEditingId(post.id || null);
        setShow(true);
    };

    const handleDelete = async (id: number | undefined) => {
        if (!id) return;
        if (window.confirm('Bạn có chắc chắn muốn xoá bài viết này không?')) {
            await axios.delete(`http://localhost:8000/posts/${id}`);
            getAllPosts();
        }
    };

    const handleSearch = () => {
        let filtered = [...posts];

        if (searchKeyword.trim() !== '') {
            filtered = filtered.filter((p) =>
                p.title.toLowerCase().includes(searchKeyword.toLowerCase())
            );
        }

        if (filterStatus !== '') {
            const statusBool = filterStatus === 'true';
            filtered = filtered.filter((p) => p.status === statusBool);
        }

        setFilteredPosts(filtered);
    };

    useEffect(() => {
        handleSearch();
    }, [searchKeyword, filterStatus, posts]);

    return (
        <div className="container mt-4">
            <h1>Danh sách các bài viết</h1>
            <div className="d-flex mb-3 gap-2">
                <input
                    type="text"
                    placeholder="Nhập từ khoá tìm kiếm"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="form-control w-50"
                />
                <select
                    className="form-select w-25"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="">Tất cả</option>
                    <option value="true">Đã xuất bản</option>
                    <option value="false">Chưa xuất bản</option>
                </select>
                <Button variant="primary" onClick={handleShow}>
                    Thêm mới bài viết
                </Button>
            </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingId ? 'Cập nhật bài viết' : 'Thêm bài viết'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Tiêu đề</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                value={post.title}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Hình ảnh</Form.Label>
                            <Form.Control
                                type="text"
                                name="image"
                                value={post.image}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Nội dung</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="content"
                                value={post.content}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                name="status"
                                label="Đã xuất bản"
                                checked={post.status}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        {editingId ? 'Cập nhật' : 'Lưu'}
                    </Button>
                </Modal.Footer>
            </Modal>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tiêu đề</th>
                        <th>Hình ảnh</th>
                        <th>Ngày viết</th>
                        <th>Trạng thái</th>
                        <th>Nội dung</th>
                        <th>Chức năng</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredPosts.map((item, index) => (
                        <tr key={item.id}>
                            <td>{index + 1}</td>
                            <td>{item.title}</td>
                            <td>
                                {item.image ? (
                                    <img src={item.image} alt="" width="100" />
                                ) : (
                                    'Không có ảnh'
                                )}
                            </td>
                            <td>{item.date}</td>
                            <td>{item.status ? 'Đã xuất bản' : 'Chưa xuất bản'}</td>
                            <td>{item.content}</td>
                            <td>
                                <Button
                                    variant="success"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => handleEdit(item)}
                                >
                                    Sửa
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleDelete(item.id)}
                                >
                                    Xoá
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}
