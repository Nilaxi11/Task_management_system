import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import PageHeader from '../../components/common/PageHeader';
import { profileSchema } from '../../validations/schemas';
import { useAuth } from '../../hooks/useAuth';
import { updateProfile } from '../../redux/slices/authSlice';
import { updateUser } from '../../redux/slices/userSlice';
import { setTheme, resetApp } from '../../redux/slices/themeSlice';
import { toast } from '../../components/common/Toast';

export default function Settings() {
  const user = useAuth();
  const theme = useSelector(s=>s.theme.mode);
  const dispatch = useDispatch();
  return (
    <>
      <PageHeader title="Settings" subtitle="Manage your profile and app preferences" crumbs={[{label:user?.role==='manager'?'Manager':'Employee'},{label:'Settings'}]} />
      <div className="row g-3">
        <div className="col-12 col-lg-7">
          <div className="tf-card">
            <div className="tf-card-header"><h6>Profile</h6></div>
            <div className="tf-card-body">
              <Formik initialValues={{ name:user.name, email:user.email, department:user.department||'' }} validationSchema={profileSchema}
                onSubmit={(vals)=>{ dispatch(updateProfile(vals)); dispatch(updateUser({id:user.id, ...vals})); toast.success('Profile updated'); }}>
                {({ values, errors, touched, handleChange, handleSubmit })=>(
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3"><label className="form-label">Name</label>
                      <input name="name" className={`form-control ${touched.name&&errors.name?'is-invalid':''}`} value={values.name} onChange={handleChange}/>
                    </div>
                    <div className="mb-3"><label className="form-label">Email</label>
                      <input name="email" type="email" className={`form-control ${touched.email&&errors.email?'is-invalid':''}`} value={values.email} onChange={handleChange}/>
                    </div>
                    <div className="mb-3"><label className="form-label" >Department</label>
                      <input name="department" className="form-control" value={values.department} onChange={handleChange}/>
                    </div>
                    <button type="submit" className="btn btn-primary">Save changes</button>
                  </form>
                )}
              </Formik>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-5">
          <div className="tf-card mb-3">
            <div className="tf-card-header"><h6>Appearance</h6></div>
            <div className="tf-card-body">
              <p className="small text-muted">Choose how TaskFlow looks to you.</p>
              <div className="d-flex gap-2">
                <button className={`btn ${theme==='light'?'btn-primary':'btn-light'}`} onClick={()=>dispatch(setTheme('light'))}><i className="bi bi-sun me-1"></i>Light</button>
                <button className={`btn ${theme==='dark'?'btn-primary':'btn-light'}`} onClick={()=>dispatch(setTheme('dark'))}><i className="bi bi-moon me-1"></i>Dark</button>
              </div>
            </div>
          </div>
          {/* <div className="tf-card">
            <div className="tf-card-header"><h6>Data</h6></div>
            <div className="tf-card-body">
              <p className="small text-muted">Reset all locally-stored data and reload the app.</p>
              <button className="btn btn-outline-danger" onClick={()=>{if(confirm('Reset all data?')) dispatch(resetApp());}}><i className="bi bi-arrow-counterclockwise me-1"></i>Reset LocalStorage</button>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
}
