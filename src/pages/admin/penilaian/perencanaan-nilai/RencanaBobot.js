import Navheader from "../../../../components/Navheader";
import Appheader from "../../../../components/Appheader";
import Adminfooter from "../../../../components/Adminfooter";
import React, {Fragment, useState} from "react";
import {Link} from "react-router-dom";
import {Badge, Descriptions, PageHeader, Space, Table, Tag} from "antd";

function RencanaBobot() {
    const dataKelas = [
        {
            "id_class": 36,
            "class": "ac",
            "sub_class": "b",
            "class_location": "jakarta",
            "academic_year": "2002",
            "name": "Guru Baru",
            "institute_id": 106
        },
        {
            "id_class": 34,
            "class": "asda",
            "sub_class": "asd",
            "class_location": "asd",
            "academic_year": "2013",
            "name": "deco12",
            "institute_id": 106
        },
        {
            "id_class": 35,
            "class": "ccac",
            "sub_class": "cc",
            "class_location": "asda",
            "academic_year": "2013",
            "name": "Hello Bagus",
            "institute_id": 106
        },
        {
            "id_class": 38,
            "class": "Kelas 1",
            "sub_class": "A",
            "class_location": "Ruang 01",
            "academic_year": "2000",
            "name": "deco1",
            "institute_id": 106
        },
        {
            "id_class": 39,
            "class": "Kelas 1",
            "sub_class": "A",
            "class_location": "Ruang 01",
            "academic_year": "2002",
            "name": "Hello Bagus",
            "institute_id": 106
        },
        {
            "id_class": 9,
            "class": "qqqqwca",
            "sub_class": "qqqq2",
            "class_location": "qqqq3",
            "academic_year": "2002",
            "name": "Hello Bagus",
            "institute_id": 106
        },
        {
            "id_class": 44,
            "class": "testdel",
            "sub_class": "a",
            "class_location": "asdads",
            "academic_year": "2020",
            "name": "Guru Baru",
            "institute_id": 106
        },
        {
            "id_class": 1,
            "class": "XII - IPS",
            "sub_class": "A",
            "class_location": "JAkartasa",
            "academic_year": "2020",
            "name": "Hello Bagus",
            "institute_id": 106
        }
    ]
    const dataMapel = [
        {
            "id_course": 1,
            "academic_year_id": 1,
            "course_name": "javascript 1",
            "course_grade_id": 1,
            "course_code": "JD",
            "is_active": "T",
            "max_student": 40,
        },
        {
            "id_course": 2,
            "academic_year_id": 1,
            "course_name": "komputer 2",
            "course_grade_id": 1,
            "course_code": "30",
            "is_active": "T",
            "max_student": 40,
        },
        {
            "id_course": 3,
            "academic_year_id": 1,
            "course_name": "komputer 3",
            "course_grade_id": 1,
            "course_code": "30",
            "is_active": "T",
            "max_student": 40,
        },
    ]
    const [totalPenilaian, setTotalPenilaian] = useState(3);

    return (
        <Fragment>
            <div className="main-wrapper">
                <Navheader/>
                <div className="main-content">
                    <Appheader/>
                    <div className="container px-3 py-4">
                        <div className="row pb-5">
                            <div className="col-lg-12">
                                <PageHeader
                                    className="site-page-header card bg-lightblue text-grey-900 fw-700 "
                                    onBack={() => window.history.back()}
                                    title="Rencana Bobot PH, PTS, dan PAS"
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-6 mb-3">
                                <div className="form-group mr-4">
                                    <select
                                        className="form-control"
                                        aria-label="Default"
                                        name="pilih_kelas"
                                    >
                                        <option value="" selected disabled>
                                            Pilih Kelas
                                        </option>
                                        {dataKelas.map((data) => (
                                            <option value={data.id_class}>{data.class}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="col-lg-6 mb-3">
                                <div className="form-group ml-4">
                                    <select
                                        className="form-control"
                                        aria-label="Default"
                                        name="pilih_kelas"
                                    >
                                        <option value="" selected disabled>
                                            Pilih Mata Pelajaran
                                        </option>
                                        {dataMapel.map((data) => (
                                            <option className="text-capitalize"
                                                    value={data.id_course}>{data.course_name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="col-lg-12 pt-5">

                                <div className="table-responsive-xl">
                                    <table className="table" style={{borderCollapse: 'collapse'}}>
                                        <thead>
                                        <tr className='bg-current text-light'>
                                            <th scope="col">Bobot Penilaian Harian (PH)</th>
                                            <th scope="col">Bobot Penilaian Tengah Semester (PTS)</th>
                                            <th scope="col">Bobot Penilaian Akhir Semester (PAS)</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr>
                                            <td>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    name='bobot_ph'
                                                    placeholder="isi bobot penilaian"
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    name='bobot_pts'
                                                    placeholder="isi bobot penilaian"
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    name='bobot_pas'
                                                    placeholder="isi bobot penilaian"
                                                />
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                    <div className="pt-10 mt-5 float-right">
                                        <button
                                            className="bg-current border-0 text-center text-white font-xsss fw-600 p-3 w175 rounded-lg d-inline-block"
                                            type="submit"
                                        >
                                            Simpan
                                        </button>
                                        <a
                                            onClick={() => window.history.back()}
                                            className="ml-2 bg-lightblue text-center text-blue font-xsss fw-600 p-3 w175 rounded-lg d-inline-block"
                                        >
                                            Batal
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/*<button onClick={() => console.log(jumlahPenilaian)}>for testing</button>*/}
                    </div>
                    <Adminfooter/>
                </div>
            </div>
        </Fragment>
    )
}

export default RencanaBobot;