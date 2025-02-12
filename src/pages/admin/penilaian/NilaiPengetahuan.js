import Navheader from "../../../../components/Navheader";
import Appheader from "../../../../components/Appheader";
import Adminfooter from "../../../../components/Adminfooter";
import React, {Fragment, useEffect, useState} from "react";
import {notification, PageHeader} from "antd";
import "../../../../style/custom.css";
import axios from "axios";
import {BASE_URL} from "../../../../api/Url";
import {get_where_no_join, global_join_sub_where_get, url_by_institute} from "../../../api/reference";

function NilaiPengetahuan() {
    const academic = localStorage.getItem("academic_year");
    const userId = localStorage.getItem("user_id");
    const [dataMapel, setDataMapel] = useState([]);
    const [dataKelas, setDataKelas] = useState([]);
    const [dataKompetensi, setDataKompetensi] = useState([]);
    const [totalPenilaian, setTotalPenilaian] = useState(3);
    const [isChecked, setIsChecked] = useState(false);
    let jumlahPenilaian = [];

    jumlahPenilaian = new Array(20).fill().map((e, i) => {
        return {
            id: i + 1,
            value: `P.${i + 1}`,
        };
    });

    const _getDataMapel = () => {
        axios
            .post(
                url_by_institute,
                {
                    processDefinitionId: global_join_sub_where_get,
                    returnVariables: true,
                    variables: [
                        {
                            name: "global_join_where_sub",
                            type: "json",
                            value: {
                                tbl_induk: "x_academic_subjects",
                                select: [
                                    "x_academic_subjects.id as id_subject",
                                    "x_academic_subject_master.nama_mata",
                                ],
                                paginate: 1000,
                                join: [
                                    {
                                        tbl_join: "x_academic_subject_master",
                                        refkey: "id",
                                        tbl_join2: "x_academic_subjects",
                                        foregenkey: "academic_subjects_master_id",
                                    },
                                ],

                                where: [
                                    {
                                        tbl_coloumn: "x_academic_subject_master",
                                        tbl_field: "academic_year_id",
                                        tbl_value: academic,
                                        operator: "=",
                                    },
                                    {
                                        tbl_coloumn: "x_academic_subject_master",
                                        tbl_field: "deleted_at",
                                        tbl_value: "",
                                        operator: "=",
                                    },
                                ],
                                order_coloumn: "x_academic_subject_master.nama_mata",
                                order_by: "asc",
                            },
                        },
                        {
                            name: "page",
                            type: "string",
                            value: "1",
                        },
                    ],
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Basic YWRtaW46TWFuYWczciE="
                    },
                }
            )
            .then(function (response) {
                const dataMapelApi = JSON.parse(response.data.variables[3].value);
                const getMapel = dataMapelApi.data.data;

                setDataMapel(getMapel);
            });
    };

    const _getDataKelas = () => {
        axios
            .post(
                url_by_institute,
                {
                    processDefinitionId: get_where_no_join,
                    returnVariables: true,
                    variables: [
                        {
                            name: "global_get_where",
                            type: "json",
                            value: {
                                tbl_name: "x_academic_class",
                                pagination: false,
                                total_result: 2,
                                order_coloumn: "x_academic_class.class",
                                order_by: "asc",
                                data: [
                                    {
                                        kondisi: "where",
                                        tbl_coloumn: "academic_year_id",
                                        tbl_value: academic,
                                        operator: "=",
                                    },
                                    {
                                        kondisi: "where",
                                        tbl_coloumn: "deleted_at",
                                        tbl_value: "",
                                        operator: "=",
                                    },
                                ],
                                tbl_coloumn: ["*"],
                            },
                        },
                    ],
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Basic YWRtaW46TWFuYWczciE="
                    },
                }
            )
            .then(function (response) {
                const data = JSON.parse(response.data.variables[2].value);
                setDataKelas(data);
            });
    };

    const _getCompetency = (e) => {
        axios
            .post(
                url_by_institute,
                {
                    processDefinitionId: global_join_sub_where_get,
                    returnVariables: true,
                    variables: [
                        {
                            name: "global_join_where_sub",
                            type: "json",
                            value: {
                                tbl_induk: "x_competence_detail",
                                select: [
                                    "x_competence_detail.id as id_detail",
                                    "x_competence_detail.competence_desc",
                                ],
                                paginate: 1000,
                                join: [
                                    {
                                        tbl_join: "x_competence",
                                        refkey: "id",
                                        tbl_join2: "x_competence_detail",
                                        foregenkey: "competence_id",
                                    },
                                ],
                                where: [
                                    {
                                        tbl_coloumn: "x_competence",
                                        tbl_field: "academic_courses_id",
                                        tbl_value: e.target.value,
                                        operator: "=",
                                    },
                                    {
                                        tbl_coloumn: "x_competence_detail",
                                        tbl_field: "competence_aspect_id",
                                        tbl_value: "1",
                                        operator: "=",
                                    },
                                ],
                                order_coloumn: "x_competence_detail.competence_desc",
                                order_by: "asc",
                            },
                        },
                        {
                            name: "page",
                            type: "string",
                            value: "1",
                        },
                    ],
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Basic YWRtaW46TWFuYWczciE="
                    },
                }
            )
            .then(function (response) {
                const competency = JSON.parse(response.data.variables[3].value);
                const allCompetency = competency.data.data;
                setDataKompetensi(allCompetency);
            });
    };

    const _submitNilai = (e) => {
        const formCV = document.querySelector("#form_perencanaan");
        const formData = new FormData(formCV);

        const teknikPenilaian = formData.getAll("teknik_penilaian");
        const bobotPenilaian = formData.getAll("bobot_penilaian");
        const namaPenilaian = formData.getAll("nama_penilaian");
        const classId = formData.get("id_class_filter");
        const subjectId = formData.get("id_mapel_filter");
        const allPlaning = [];

        for (let i = 0; i < totalPenilaian; i++) {
            allPlaning.push({
                competence_aspect_id: "1",
                serial: i + 1,
                assessment_technique_id: teknikPenilaian[i],
                assessment_bobot: bobotPenilaian[i],
                assessment_name: namaPenilaian[i],
            });
        }

        let elementKompetensi = document.querySelectorAll(
            "#form_perencanaan input[type=checkbox]"
        );

        for (let index = 0; index < elementKompetensi.length; index++) {
            if (elementKompetensi.value === "")
                elementKompetensi = elementKompetensi.value[index];
        }
        const boxKompetensi = Array.from(elementKompetensi);

        const allCompetency = boxKompetensi.map((el) => {
            return {
                detail_id: el.id.split("_")[1],
                penilaian: el.id.split("_")[2],
                check: el.checked,
            };
        });

        const insertToApi = {
            academic_id: academic,
            class_id: classId,
            subjects_id: subjectId,
            created_by: userId,
            jumlah_penilaian: totalPenilaian,
            planing: allPlaning,
            kompetensi: allCompetency,
        };

        console.log(insertToApi);

<<<<<<< HEAD
            setDataMapel(getMapel
    )
        ;
    }
)
}

const _getDataKelas = () => {
    axios
        .post(
            BASE_URL,
            {
                "processDefinitionId": "getwherenojoin:2:8b42da08-dfed-11ec-a2ad-3a00788faff5",
                "returnVariables": true,
                "variables": [
                    {
                        "name": "global_get_where",
                        "type": "json",
                        "value": {
                            "tbl_name": "x_academic_class",
                            "pagination": false,
                            "total_result": 2,
                            "order_coloumn": "x_academic_class.class",
                            "order_by": "asc",
                            "data": [
                                {
                                    "kondisi": "where",
                                    "tbl_coloumn": "academic_year_id",
                                    "tbl_value": academic,
                                    "operator": "="
                                },
                                {
                                    "kondisi": "where",
                                    "tbl_coloumn": "deleted_at",
                                    "tbl_value": "",
                                    "operator": "="
                                }
                            ],
                            "tbl_coloumn": [
                                "*"
                            ]
                        }
                    }
                ]
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Basic YWRtaW46TWFuYWczciE="
                },
            }
        )
        .then(function (response) {
            const data = JSON.parse(response.data.variables[2].value);
            setDataKelas(data);
        })
}

const _getCompetency = (e) => {
    axios
        .post(
            BASE_URL,
            {
                "processDefinitionId": "globaljoinsubwhereget:1:f0387a49-eaeb-11ec-9ea6-c6ec5d98c2df",
                "returnVariables": true,
                "variables": [
                    {
                        "name": "global_join_where_sub",
                        "type": "json",
                        "value": {
                            "tbl_induk": "x_competence_detail",
                            "select": [
                                "x_competence_detail.id as id_detail",
                                "x_competence_detail.competence_desc",
                                "x_competence_detail.code"

                            ],
                            "paginate": 1000,
                            "join": [
                                {
                                    "tbl_join": "x_competence",
                                    "refkey": "id",
                                    "tbl_join2": "x_competence_detail",
                                    "foregenkey": "competence_id"
                                }
                            ],
                            "where": [
                                {
                                    "tbl_coloumn": "x_competence",
                                    "tbl_field": "academic_courses_id",
                                    "tbl_value": e.target.value,
                                    "operator": "="
                                }, {
                                    "tbl_coloumn": "x_competence_detail",
                                    "tbl_field": "competence_aspect_id",
                                    "tbl_value": "1",
                                    "operator": "="
                                }
                            ],
                            "order_coloumn": "x_competence_detail.competence_desc",
                            "order_by": "asc"
                        }
                    },
                    {
                        "name": "page",
                        "type": "string",
                        "value": "1"
                    }
                ]
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Basic YWRtaW46TWFuYWczciE="
                },
            }
        )
        .then(function (response) {
            const competency = JSON.parse(response.data.variables[3].value);
            const allCompetency = competency.data.data
            setDataKompetensi(allCompetency);
        })
}


const _submitNilai = (e) => {
    const formCV = document.querySelector('#form_perencanaan');
    const formData = new FormData(formCV);

    const teknikPenilaian = formData.getAll('teknik_penilaian');
    console.log(teknikPenilaian);

    const bobotPenilaian = formData.getAll('bobot_penilaian');
    const namaPenilaian = formData.getAll('nama_penilaian');
    const classId = formData.get('id_class_filter');
    const subjectId = formData.get('id_mapel_filter');
    const allPlaning = [];

    for (let i = 0; i < totalPenilaian; i++) {
        allPlaning.push({
            competence_aspect_id: "1",
            serial: i + 1,
            assessment_technique_id: teknikPenilaian[i],
            assessment_bobot: bobotPenilaian[i],
            assessment_name: namaPenilaian[i],
        });

        axios
            .post(
                BASE_URL,
                {
<<<<<<< HEAD
                    processDefinitionId: "5cb935c9-07da-11ed-ac5e-66fc627bf211",
=======
                    processDefinitionId: "6f4cd0c4-2d97-11ed-aacc-9a44706f3589",
>>>>>>> fe312edede8f5b0256f747d2f408e42f370421b5
                    returnVariables: true,
                    variables: [
                        {
                            name: "get_data",
                            type: "json",
                            value: insertToApi,
                        },
                    ],
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Basic YWRtaW46TWFuYWczciE="
                    },
                }
            )
            .then(function (response) {
                const dataRes = JSON.parse(response.data.variables[2].value);
                const resCode = dataRes.code;

                if (resCode === "true") {
                    notification.success({
                        message: "Sukses",
                        description: "Perencanaan nilai pengetahuan berhasil di input",
                        placement: "top",
                    });
                } else {
                    notification.info({
                        message: "Gagal",
                        description:
                            "Perencanaan nilai pengetahuan gagal. Pastikan Form telah diisi semua",
                        placement: "top",
                    });
                }
            });
    }
    ;

    useEffect(() => {
        _getDataKelas();
        _getDataMapel();
    }, []);

    return (
        <Fragment>
            <div className="main-wrapper custom-table">
                <Navheader/>
                <div className="main-content">
                    <Appheader/>
                    <div className="container px-3 py-4">
                        <div className="row pb-5">
                            <div className="col-lg-12">
                                <PageHeader
                                    className="site-page-header card bg-lightblue text-grey-900 fw-700 "
                                    onBack={() => window.history.back()}
                                    title="Rencana Nilai Pengetahuan"
                                />
                            </div>
                        </div>
                        <form id="form_perencanaan">
                            <div className="row">
                                <div className="col-lg-4 mb-3">
                                    <div className="form-group">
                                        <select className="form-control" name="id_class_filter">
                                            <option value="" selected disabled>
                                                Pilih Kelas
                                            </option>
                                            {dataKelas.map((data) => (
                                                <option value={data.id}>{data.class}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-lg-4 mb-3">
                                    <div className="form-group">
                                        <select
                                            className="form-control"
                                            name="id_mapel_filter"
                                            onChange={(e) => _getCompetency(e)}
                                        >
                                            <option value="" selected disabled>
                                                Pilih Mata Pelajaran
                                            </option>
                                            {dataMapel.map((data) => (
                                                <option value={data.id_subject}>
                                                    {data.nama_mata}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-lg-4 mb-3">
                                    <div className="form-group">
                                        <select
                                            className="form-control"
                                            aria-label="Default"
                                            name="pilih_penilaian"
                                            onChange={(e) => setTotalPenilaian(e.target.value)}
                                        >
                                            <option value="" selected disabled>
                                                Jumlah Penilaian
                                            </option>
                                            {jumlahPenilaian.map((data) => (
                                                <option className="text-capitalize" value={data.id}>
                                                    {data.id}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div className="table-custom">
                                        <table className="table table-bordered">
                                            <thead>
                                            <tr className="bg-current text-light text-center">
                                                <th scope="col">Penilaian</th>

                                                {totalPenilaian > 0 && (
                                                    <>
                                                        {[...Array(Number(totalPenilaian)).keys()].map(
                                                            (data, index) => {
                                                                return (
                                                                    <th scope="col">Penilaian {data + 1}</th>
                                                                );
                                                            }
                                                        )}
                                                    </>
                                                )}
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr>
                                                <th scope="row">Kelompok / Teknik Penilaian</th>
                                                {totalPenilaian > 0 && (
                                                    <>
                                                        {[...Array(Number(totalPenilaian)).keys()].map(
                                                            (data, index) => {
                                                                return (
                                                                    <td>
                                                                        <select
                                                                            className="form-control"
                                                                            aria-label="Default"
                                                                            name="teknik_penilaian"
                                                                        >
                                                                            <option value="1">Tes Lisan</option>
                                                                            <option value="2">Tes Tulis</option>
                                                                            <option value="3">Penugasan</option>
                                                                        </select>
                                                                    </td>
                                                                );
                                                            }
                                                        )}
                                                    </>
                                                )}
                                            </tr>
                                            <tr>
                                                <th scope="row">Bobot Teknik Penilaian</th>
                                                {totalPenilaian > 0 && (
                                                    <>
                                                        {[...Array(Number(totalPenilaian)).keys()].map(
                                                            (data, index) => {
                                                                return (
                                                                    <td>
                                                                        <input
                                                                            type="number"
                                                                            className="form-control"
                                                                            name="bobot_penilaian"
                                                                            placeholder="isi bobot penilaian"
                                                                        />
                                                                    </td>
                                                                );
                                                            }
                                                        )}
                                                    </>
                                                )}
                                            </tr>
                                            <tr>
                                                <th scope="row">Nama Penilaian</th>
                                                {totalPenilaian > 0 && (
                                                    <>
                                                        {[...Array(Number(totalPenilaian)).keys()].map(
                                                            (data, index) => {
                                                                return (
                                                                    <td>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            name="nama_penilaian"
                                                                            placeholder="isi nama penilaian"
                                                                        />
                                                                    </td>
                                                                );
                                                            }
                                                        )}
                                                    </>
                                                )}
                                            </tr>
                                            <tr style={{borderRightStyle: "hidden"}}>
                                                <th
                                                    scope="row"
                                                    style={{
                                                        borderLeftStyle: "hidden",
                                                        borderRightStyle: "hidden",
                                                        backgroundColor: "white",
                                                        color: "black",
                                                    }}
                                                >
                                                    <h3>
                                                        <b>Kompetensi Dasar</b>
                                                    </h3>
                                                </th>
                                            </tr>
                                            {dataKompetensi.map((data) => (
                                                <tr style={{borderStyle: "hidden"}}>
                                                    <th
                                                        scope="row"
                                                        style={{
                                                            borderRightStyle: "hidden",
                                                            backgroundColor: "white",
                                                            color: "black",
                                                            textTransform: "capitalize",
                                                        }}
                                                    >
                                                        {data.competence_desc}
                                                    </th>
                                                    {totalPenilaian > 0 && (
                                                        <>
                                                            {[...Array(Number(totalPenilaian)).keys()].map(
                                                                (item, index) => {
                                                                    return (
                                                                        <td
                                                                            style={{borderRightStyle: "hidden"}}
                                                                        >
                                                                            <input
                                                                                type="checkbox"
                                                                                className="form-control"
                                                                                style={{zoom: 0.4}}
                                                                                // name={`kompetensi_${data.id_detail}_${index + 1}`}
                                                                                name="kompetensi"
                                                                                id={`kompetensi_${data.id_detail}_${
                                                                                    index + 1
                                                                                }`}
                                                                                key={data.id_detail}
                                                                                onChange={(e) => {
                                                                                    setIsChecked(e?.target?.checked);
                                                                                }}
                                                                                value={isChecked}
                                                                            />
                                                                        </td>
                                                                    );
                                                                }
                                                            )}
                                                        </>
                                                    )}
                                                </tr>
                                            ))}
                                            {/*<tr style={{borderStyle: 'hidden'}}>*/}
                                            {/*    <th scope="row" style={{*/}
                                            {/*        borderRightStyle: 'hidden',*/}
                                            {/*        backgroundColor: 'white',*/}
                                            {/*        color: 'black'*/}
                                            {/*    }}>*/}
                                            {/*        3.1 Mengidentifikasi Gerakan Dasar Senam*/}
                                            {/*    </th>*/}
                                            {/*    {totalPenilaian > 0 &&*/}
                                            {/*        <>*/}
                                            {/*            {[...Array(Number(totalPenilaian)).keys()]*/}
                                            {/*                .map(data => {*/}
                                            {/*                    return (*/}
                                            {/*                        <td style={{borderRightStyle: 'hidden'}}>*/}
                                            {/*                            <input*/}
                                            {/*                                type="checkbox"*/}
                                            {/*                                className="form-control"*/}
                                            {/*                                style={{zoom: 0.4}}*/}
                                            {/*                                name={`kompetensi1_p${data + 1}`}*/}
                                            {/*                                placeholder="isi nama penilaian"*/}
                                            {/*                            />*/}
                                            {/*                        </td>*/}
                                            {/*                    )*/}
                                            {/*                })}*/}
                                            {/*        </>*/}
                                            {/*    }*/}
                                            {/*</tr>*/}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </form>
                        <div className="row">
                            <div className="col">
                                <div className="mt-5 mb-4 float-right">
                                    <button
                                        className="bg-current border-0 text-center text-white font-xsss fw-600 p-3 w175 rounded-lg d-inline-block"
                                        onClick={_submitNilai}
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
                    <Adminfooter/>
                </div>
            </div>
        </Fragment>
    );
=======
        // setDataMapel(getMapel)
    }

    // const _getDataKelas = () => {
    //     axios
    //         .post(
    //             BASE_URL,
    //             {
    //                 "processDefinitionId": "getwherenojoin:2:8b42da08-dfed-11ec-a2ad-3a00788faff5",
    //                 "returnVariables": true,
    //                 "variables": [
    //                     {
    //                         "name": "global_get_where",
    //                         "type": "json",
    //                         "value": {
    //                             "tbl_name": "x_academic_class",
    //                             "pagination": false,
    //                             "total_result": 2,
    //                             "order_coloumn": "x_academic_class.class",
    //                             "order_by": "asc",
    //                             "data": [
    //                                 {
    //                                     "kondisi": "where",
    //                                     "tbl_coloumn": "academic_year_id",
    //                                     "tbl_value": academic,
    //                                     "operator": "="
    //                                 },
    //                                 {
    //                                     "kondisi": "where",
    //                                     "tbl_coloumn": "deleted_at",
    //                                     "tbl_value": "",
    //                                     "operator": "="
    //                                 }
    //                             ],
    //                             "tbl_coloumn": [
    //                                 "*"
    //                             ]
    //                         }
    //                     }
    //                 ]
    //             },
    //             {
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                     "Authorization": "Basic YWRtaW46TWFuYWczciE="
    //                 },
    //             }
    //         )
    //         .then(function (response) {
    //             const data = JSON.parse(response.data.variables[2].value);
    //             setDataKelas(data);
    //         })
    // }
    //
    // const _getCompetency = (e) => {
    //     axios
    //         .post(
    //             BASE_URL,
    //             {
    //                 "processDefinitionId": "globaljoinsubwhereget:1:f0387a49-eaeb-11ec-9ea6-c6ec5d98c2df",
    //                 "returnVariables": true,
    //                 "variables": [
    //                     {
    //                         "name": "global_join_where_sub",
    //                         "type": "json",
    //                         "value": {
    //                             "tbl_induk": "x_competence_detail",
    //                             "select": [
    //                                 "x_competence_detail.id as id_detail",
    //                                 "x_competence_detail.competence_desc",
    //                                 "x_competence_detail.code"
    //
    //                             ],
    //                             "paginate": 1000,
    //                             "join": [
    //                                 {
    //                                     "tbl_join": "x_competence",
    //                                     "refkey": "id",
    //                                     "tbl_join2": "x_competence_detail",
    //                                     "foregenkey": "competence_id"
    //                                 }
    //                             ],
    //                             "where": [
    //                                 {
    //                                     "tbl_coloumn": "x_competence",
    //                                     "tbl_field": "academic_courses_id",
    //                                     "tbl_value": e.target.value,
    //                                     "operator": "="
    //                                 }, {
    //                                     "tbl_coloumn": "x_competence_detail",
    //                                     "tbl_field": "competence_aspect_id",
    //                                     "tbl_value": "1",
    //                                     "operator": "="
    //                                 }
    //                             ],
    //                             "order_coloumn": "x_competence_detail.competence_desc",
    //                             "order_by": "asc"
    //                         }
    //                     },
    //                     {
    //                         "name": "page",
    //                         "type": "string",
    //                         "value": "1"
    //                     }
    //                 ]
    //             },
    //             {
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                     "Authorization": "Basic YWRtaW46TWFuYWczciE="
    //                 },
    //             }
    //         )
    //         .then(function (response) {
    //             const competency = JSON.parse(response.data.variables[3].value);
    //             const allCompetency = competency.data.data
    //             setDataKompetensi(allCompetency);
    //         })
    // }
    //
    // const _submitNilai = (e) => {
    //     const formCV = document.querySelector('#form_perencanaan');
    //     const formData = new FormData(formCV);
    //
    //     const teknikPenilaian = formData.getAll('teknik_penilaian');
    //     console.log(teknikPenilaian);
    //
    //     const bobotPenilaian = formData.getAll('bobot_penilaian');
    //     const namaPenilaian = formData.getAll('nama_penilaian');
    //     const classId = formData.get('id_class_filter');
    //     const subjectId = formData.get('id_mapel_filter');
    //     const allPlaning = [];
    //
    //     for (let i = 0; i < totalPenilaian; i++) {
    //         allPlaning.push({
    //             competence_aspect_id: "1",
    //             serial: i + 1,
    //             assessment_technique_id: teknikPenilaian[i],
    //             assessment_bobot: bobotPenilaian[i],
    //             assessment_name: namaPenilaian[i],
    //         });
    //
    //         axios
    //             .post(
    //                 BASE_URL,
    //                 {
    //                     processDefinitionId: "6f4cd0c4-2d97-11ed-aacc-9a44706f3589",
    //                     returnVariables: true,
    //                     variables: [
    //                         {
    //                             name: "get_data",
    //                             type: "json",
    //                             value: insertToApi,
    //                         },
    //                     ],
    //                 },
    //                 {
    //                     headers: {
    //                         "Content-Type": "application/json",
    //                         "Authorization": "Basic YWRtaW46TWFuYWczciE="
    //                     },
    //                 }
    //             )
    //             .then(function (response) {
    //                 const dataRes = JSON.parse(response.data.variables[2].value);
    //                 const resCode = dataRes.code;
    //
    //                 if (resCode === "true") {
    //                     notification.success({
    //                         message: "Sukses",
    //                         description: "Perencanaan nilai pengetahuan berhasil di input",
    //                         placement: "top",
    //                     });
    //                 } else {
    //                     notification.info({
    //                         message: "Gagal",
    //                         description:
    //                             "Perencanaan nilai pengetahuan gagal. Pastikan Form telah diisi semua",
    //                         placement: "top",
    //                     });
    //                 }
    //             });
    //     }
    //     ;
    //
    //     useEffect(() => {
    //         _getDataKelas();
    //         _getDataMapel();
    //     }, []);
    //
    //     return (
    //         <Fragment>
    //             <div className="main-wrapper custom-table">
    //                 <Navheader/>
    //                 <div className="main-content">
    //                     <Appheader/>
    //                     <div className="container px-3 py-4">
    //                         <div className="row pb-5">
    //                             <div className="col-lg-12">
    //                                 <PageHeader
    //                                     className="site-page-header card bg-lightblue text-grey-900 fw-700 "
    //                                     onBack={() => window.history.back()}
    //                                     title="Rencana Nilai Pengetahuan"
    //                                 />
    //                             </div>
    //                         </div>
    //                         <form id="form_perencanaan">
    //                             <div className="row">
    //                                 <div className="col-lg-4 mb-3">
    //                                     <div className="form-group">
    //                                         <select className="form-control" name="id_class_filter">
    //                                             <option value="" selected disabled>
    //                                                 Pilih Kelas
    //                                             </option>
    //                                             {dataKelas.map((data) => (
    //                                                 <option value={data.id}>{data.class}</option>
    //                                             ))}
    //                                         </select>
    //                                     </div>
    //                                 </div>
    //                                 <div className="col-lg-4 mb-3">
    //                                     <div className="form-group">
    //                                         <select
    //                                             className="form-control"
    //                                             name="id_mapel_filter"
    //                                             onChange={(e) => _getCompetency(e)}
    //                                         >
    //                                             <option value="" selected disabled>
    //                                                 Pilih Mata Pelajaran
    //                                             </option>
    //                                             {dataMapel.map((data) => (
    //                                                 <option value={data.id_subject}>
    //                                                     {data.nama_mata}
    //                                                 </option>
    //                                             ))}
    //                                         </select>
    //                                     </div>
    //                                 </div>
    //                                 <div className="col-lg-4 mb-3">
    //                                     <div className="form-group">
    //                                         <select
    //                                             className="form-control"
    //                                             aria-label="Default"
    //                                             name="pilih_penilaian"
    //                                             onChange={(e) => setTotalPenilaian(e.target.value)}
    //                                         >
    //                                             <option value="" selected disabled>
    //                                                 Jumlah Penilaian
    //                                             </option>
    //                                             {jumlahPenilaian.map((data) => (
    //                                                 <option className="text-capitalize" value={data.id}>
    //                                                     {data.id}
    //                                                 </option>
    //                                             ))}
    //                                         </select>
    //                                     </div>
    //                                 </div>
    //                                 <div className="col-lg-12">
    //                                     <div className="table-custom">
    //                                         <table className="table table-bordered">
    //                                             <thead>
    //                                             <tr className="bg-current text-light text-center">
    //                                                 <th scope="col">Penilaian</th>
    //
    //                                                 {totalPenilaian > 0 && (
    //                                                     <>
    //                                                         {[...Array(Number(totalPenilaian)).keys()].map(
    //                                                             (data, index) => {
    //                                                                 return (
    //                                                                     <th scope="col">Penilaian {data + 1}</th>
    //                                                                 );
    //                                                             }
    //                                                         )}
    //                                                     </>
    //                                                 )}
    //                                             </tr>
    //                                             </thead>
    //                                             <tbody>
    //                                             <tr>
    //                                                 <th scope="row">Kelompok / Teknik Penilaian</th>
    //                                                 {totalPenilaian > 0 && (
    //                                                     <>
    //                                                         {[...Array(Number(totalPenilaian)).keys()].map(
    //                                                             (data, index) => {
    //                                                                 return (
    //                                                                     <td>
    //                                                                         <select
    //                                                                             className="form-control"
    //                                                                             aria-label="Default"
    //                                                                             name="teknik_penilaian"
    //                                                                         >
    //                                                                             <option value="1">Tes Lisan</option>
    //                                                                             <option value="2">Tes Tulis</option>
    //                                                                             <option value="3">Penugasan</option>
    //                                                                         </select>
    //                                                                     </td>
    //                                                                 );
    //                                                             }
    //                                                         )}
    //                                                     </>
    //                                                 )}
    //                                             </tr>
    //                                             <tr>
    //                                                 <th scope="row">Bobot Teknik Penilaian</th>
    //                                                 {totalPenilaian > 0 && (
    //                                                     <>
    //                                                         {[...Array(Number(totalPenilaian)).keys()].map(
    //                                                             (data, index) => {
    //                                                                 return (
    //                                                                     <td>
    //                                                                         <input
    //                                                                             type="number"
    //                                                                             className="form-control"
    //                                                                             name="bobot_penilaian"
    //                                                                             placeholder="isi bobot penilaian"
    //                                                                         />
    //                                                                     </td>
    //                                                                 );
    //                                                             }
    //                                                         )}
    //                                                     </>
    //                                                 )}
    //                                             </tr>
    //                                             <tr>
    //                                                 <th scope="row">Nama Penilaian</th>
    //                                                 {totalPenilaian > 0 && (
    //                                                     <>
    //                                                         {[...Array(Number(totalPenilaian)).keys()].map(
    //                                                             (data, index) => {
    //                                                                 return (
    //                                                                     <td>
    //                                                                         <input
    //                                                                             type="text"
    //                                                                             className="form-control"
    //                                                                             name="nama_penilaian"
    //                                                                             placeholder="isi nama penilaian"
    //                                                                         />
    //                                                                     </td>
    //                                                                 );
    //                                                             }
    //                                                         )}
    //                                                     </>
    //                                                 )}
    //                                             </tr>
    //                                             <tr style={{borderRightStyle: "hidden"}}>
    //                                                 <th
    //                                                     scope="row"
    //                                                     style={{
    //                                                         borderLeftStyle: "hidden",
    //                                                         borderRightStyle: "hidden",
    //                                                         backgroundColor: "white",
    //                                                         color: "black",
    //                                                     }}
    //                                                 >
    //                                                     <h3>
    //                                                         <b>Kompetensi Dasar</b>
    //                                                     </h3>
    //                                                 </th>
    //                                             </tr>
    //                                             {dataKompetensi.map((data) => (
    //                                                 <tr style={{borderStyle: "hidden"}}>
    //                                                     <th
    //                                                         scope="row"
    //                                                         style={{
    //                                                             borderRightStyle: "hidden",
    //                                                             backgroundColor: "white",
    //                                                             color: "black",
    //                                                             textTransform: "capitalize",
    //                                                         }}
    //                                                     >
    //                                                         {data.competence_desc}
    //                                                     </th>
    //                                                     {totalPenilaian > 0 && (
    //                                                         <>
    //                                                             {[...Array(Number(totalPenilaian)).keys()].map(
    //                                                                 (item, index) => {
    //                                                                     return (
    //                                                                         <td
    //                                                                             style={{borderRightStyle: "hidden"}}
    //                                                                         >
    //                                                                             <input
    //                                                                                 type="checkbox"
    //                                                                                 className="form-control"
    //                                                                                 style={{zoom: 0.4}}
    //                                                                                 // name={`kompetensi_${data.id_detail}_${index + 1}`}
    //                                                                                 name="kompetensi"
    //                                                                                 id={`kompetensi_${data.id_detail}_${
    //                                                                                     index + 1
    //                                                                                 }`}
    //                                                                                 key={data.id_detail}
    //                                                                                 onChange={(e) => {
    //                                                                                     setIsChecked(e?.target?.checked);
    //                                                                                 }}
    //                                                                                 value={isChecked}
    //                                                                             />
    //                                                                         </td>
    //                                                                     );
    //                                                                 }
    //                                                             )}
    //                                                         </>
    //                                                     )}
    //                                                 </tr>
    //                                             ))}
    //                                             {/*<tr style={{borderStyle: 'hidden'}}>*/}
    //                                             {/*    <th scope="row" style={{*/}
    //                                             {/*        borderRightStyle: 'hidden',*/}
    //                                             {/*        backgroundColor: 'white',*/}
    //                                             {/*        color: 'black'*/}
    //                                             {/*    }}>*/}
    //                                             {/*        3.1 Mengidentifikasi Gerakan Dasar Senam*/}
    //                                             {/*    </th>*/}
    //                                             {/*    {totalPenilaian > 0 &&*/}
    //                                             {/*        <>*/}
    //                                             {/*            {[...Array(Number(totalPenilaian)).keys()]*/}
    //                                             {/*                .map(data => {*/}
    //                                             {/*                    return (*/}
    //                                             {/*                        <td style={{borderRightStyle: 'hidden'}}>*/}
    //                                             {/*                            <input*/}
    //                                             {/*                                type="checkbox"*/}
    //                                             {/*                                className="form-control"*/}
    //                                             {/*                                style={{zoom: 0.4}}*/}
    //                                             {/*                                name={`kompetensi1_p${data + 1}`}*/}
    //                                             {/*                                placeholder="isi nama penilaian"*/}
    //                                             {/*                            />*/}
    //                                             {/*                        </td>*/}
    //                                             {/*                    )*/}
    //                                             {/*                })}*/}
    //                                             {/*        </>*/}
    //                                             {/*    }*/}
    //                                             {/*</tr>*/}
    //                                             </tbody>
    //                                         </table>
    //                                     </div>
    //                                 </div>
    //                             </div>
    //                         </form>
    //                         <div className="row">
    //                             <div className="col">
    //                                 <div className="mt-5 mb-4 float-right">
    //                                     <button
    //                                         className="bg-current border-0 text-center text-white font-xsss fw-600 p-3 w175 rounded-lg d-inline-block"
    //                                         onClick={_submitNilai}
    //                                     >
    //                                         Simpan
    //                                     </button>
    //                                     <a
    //                                         onClick={() => window.history.back()}
    //                                         className="ml-2 bg-lightblue text-center text-blue font-xsss fw-600 p-3 w175 rounded-lg d-inline-block"
    //                                     >
    //                                         Batal
    //                                     </a>
    //                                 </div>
    //                             </div>
    //                         </div>
    //                     </div>
    //                     <Adminfooter/>
    //                 </div>
    //             </div>
    //         </Fragment>
    //     );
    // }
>>>>>>> 04cdaff79a08dcd8fb1e26ff774c77eb3d98a2a4
}

export default NilaiPengetahuan;
