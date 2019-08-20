import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import SuccesAlert from './SuccessAlert';
import ErrorAlert from './ErrorAlert';




export default class Listing extends Component {
    constructor() {
        super();
        this.state = {
            categories: [],
            activePage: null,
            itemsCountPerPage: null,
            totalItemsCount: null,
            pageRangeDisplayed: null,
            alert: false
        }
    }

    componentDidMount() {
        axios.get('http://localhost:8000/api/category')
            .then(response => {
                this.setState({
                    categories: response.data.data,
                    activePage: response.data.current_page,
                    itemsCountPerPage: response.data.per_page,
                    totalItemsCount: response.data.total,
                    pageRangeDisplayed: response.data.to
                })
            })
    }
    handlePageChange(pageNumber) {
        axios.get('http://localhost:8000/api/category?page=' + pageNumber)
            .then(res => this.setState({
                categories: res.data.data,
                activePage: res.data.current_page,

            }))
        console.log(`active page is ${pageNumber}`);
    }
    onDelete(id) {
        axios.delete('http://localhost:8000//api/category/delete/' + id)
            .then(res => {
                let categories = this.state.categories;
                for (let i = 0; i < categories.length; i++) {
                    if (categories[i].id == id) {
                        categories.splice(i, 1);
                        this.setState({ categories, alert: 'success' })
                    };
                }
            })
            .catch(() => this.setState({ alert: 'error' }));

    }
    render() {
        return (
            <div>
                {this.state.alert == 'success' ? <SuccesAlert message={"Category Deleted Succesfully"} /> : null}
                {this.state.alert == 'error' ? <ErrorAlert message={"Failed to Delete the Category"} /> : null}
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Category Name</th>
                            <th scope="col">Status</th>
                            <th scope="col">Created At</th>
                            <th scope="col">Updated At</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.categories.map(category => {
                                return (
                                    <tr key={category.id}>
                                        <th scope="row">1</th>
                                        <td>{category.name}</td>
                                        <td>{category.active == 1 ? 'Active' : 'InActive'}</td>
                                        <td>{category.created_at}</td>
                                        <td>{category.updated_at}</td>
                                        <td><Link to={`category/edit/${category.id}`}>Edit</Link>
                                            <a href='#' onClick={this.onDelete.bind(this, category.id)}>Delete</a></td>
                                    </tr>
                                )
                            })
                        }

                    </tbody>

                </table>
                <div className="d-flex justify-content-center">
                    <Pagination
                        activePage={this.state.activePage}
                        itemsCountPerPage={this.state.itemsCountPerPage}
                        totalItemsCount={this.state.totalItemsCount}
                        pageRangeDisplayed={this.state.pageRangeDisplayed}
                        onChange={this.handlePageChange.bind(this)}
                        itemClass='page-item'
                        linkClass='page-link'
                    />
                </div>
            </div>
        )
    }
}