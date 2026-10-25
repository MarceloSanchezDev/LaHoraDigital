import {Component} from 'react';
export default class ErrorBoundary extends Component{
  state={failed:false};
  static getDerivedStateFromError(){return {failed:true};}
  render(){return this.state.failed?<section className="container" role="alert" style={{paddingBlock:64}}><h1>No pudimos mostrar la página</h1><p>Intentá recargarla. Si el problema continúa, volvé a entrar más tarde.</p><button onClick={()=>window.location.reload()}>Recargar página</button></section>:this.props.children;}
}
